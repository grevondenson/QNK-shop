import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import reservationModel from "../models/reservationModel.js";
import paymentAttemptModel from "../models/paymentAttemptModel.js";
import userModel from "../models/userModel.js";

const currency = "KES";
const shippingMinor = Number(process.env.SHIPPING_FEE_MINOR || 5000);
const reservationMinutes = Number(process.env.RESERVATION_MINUTES || 15);

const normalisePhone = (phone) => {
    const digits = String(phone || "").replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
    if (digits.startsWith("254") && digits.length === 12) return digits;
    return null;
};

const validateLines = async (items) => {
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) throw new Error("Cart is empty or too large");
    const lines = [];
    for (const item of items) {
        const quantity = Number(item.quantity);
        if (!mongoose.isValidObjectId(item.productId) || !mongoose.isValidObjectId(item.variantId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
            throw new Error("Invalid cart item");
        }
        const product = await productModel.findOne({ _id: item.productId, status: "active" }).lean();
        const variant = product?.variants?.find((entry) => entry._id.toString() === item.variantId);
        if (!variant || !variant.active) throw new Error("A selected bag variant is unavailable");
        const available = variant.stockOnHand - variant.reservedQuantity;
        if (available < quantity) throw new Error(`Insufficient stock for ${product.name} (${variant.colour})`);
        lines.push({
            productId: product._id,
            variantId: variant._id,
            sku: variant.sku,
            title: product.name,
            colour: variant.colour,
            material: variant.material,
            unitPriceMinor: variant.priceMinor,
            quantity,
            lineTotalMinor: variant.priceMinor * quantity
        });
    }
    return lines;
};

const quoteOrder = async (req, res) => {
    try {
        const lines = await validateLines(req.body.items);
        const subtotalMinor = lines.reduce((total, line) => total + line.lineTotalMinor, 0);
        const totalMinor = subtotalMinor + shippingMinor;
        res.json({ success: true, quote: { items: lines, subtotalMinor, shippingMinor, totalMinor, depositMinor: Math.ceil(totalMinor * 0.2), currency } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const createReservationOrder = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { items, address, phone } = req.body;
        const customerPhone = normalisePhone(phone || address?.phone);
        if (!customerPhone || !address?.firstName || !address?.city) throw new Error("Valid delivery details and Kenyan phone number are required");
        const lines = await validateLines(items);
        const subtotalMinor = lines.reduce((total, line) => total + line.lineTotalMinor, 0);
        const totalMinor = subtotalMinor + shippingMinor;
        const depositMinor = Math.ceil(totalMinor * 0.2);
        const orderNumber = `QNK-${Date.now().toString(36).toUpperCase()}`;
        let order;
        await session.withTransaction(async () => {
            for (const line of lines) {
                const updated = await productModel.findOneAndUpdate(
                    { _id: line.productId, "variants._id": line.variantId, "variants.active": true, "variants.stockOnHand": { $gte: line.quantity } },
                    { $inc: { "variants.$.reservedQuantity": line.quantity } },
                    { session, new: true }
                );
                const variant = updated?.variants.find((entry) => entry._id.toString() === line.variantId.toString());
                if (!variant || variant.stockOnHand - variant.reservedQuantity < 0) throw new Error("Stock changed; please refresh your cart");
            }
            [order] = await orderModel.create([{
                orderNumber, userId: req.body.userId || null, items: lines, amount: totalMinor / 100,
                subtotalMinor, shippingMinor, depositMinor, currency, address: { ...address, phone: customerPhone },
                status: "Reservation Pending", paymentMethod: "MPESA", paymentStatus: "pending", date: Date.now()
            }], { session });
            await reservationModel.create([{
                orderId: order._id, items: lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity })),
                expiresAt: new Date(Date.now() + reservationMinutes * 60 * 1000)
            }], { session });
        });
        res.status(201).json({ success: true, orderId: order._id, orderNumber, amountMinor: depositMinor, currency, expiresAt: new Date(Date.now() + reservationMinutes * 60 * 1000) });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    } finally {
        await session.endSession();
    }
};

const mpesaToken = async () => {
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET || !process.env.MPESA_SHORTCODE || !process.env.MPESA_PASSKEY || !process.env.MPESA_CALLBACK_URL) {
        throw new Error("M-Pesa merchant credentials and callback URL are not configured");
    }
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
    const response = await fetch(`${process.env.MPESA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } });
    if (!response.ok) throw new Error("M-Pesa authentication failed");
    return (await response.json()).access_token;
};

const initiateMpesa = async (req, res) => {
    try {
        const phone = normalisePhone(req.body.phone);
        if (!phone || !mongoose.isValidObjectId(req.body.orderId)) throw new Error("Valid order and Kenyan phone number are required");
        const order = await orderModel.findOne({ _id: req.body.orderId, userId: req.body.userId, paymentStatus: "pending" });
        if (!order) throw new Error("Payment order is unavailable");
        const token = await mpesaToken();
        const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
        const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");
        const baseUrl = process.env.MPESA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
        const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({
            BusinessShortCode: process.env.MPESA_SHORTCODE, Password: password, Timestamp: timestamp, TransactionType: process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline",
            Amount: Math.ceil(order.depositMinor / 100), PartyA: phone, PartyB: process.env.MPESA_SHORTCODE, PhoneNumber: phone, CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: order.orderNumber, TransactionDesc: "QNK Noire reservation deposit"
        }) });
        const result = await response.json();
        if (!response.ok || result.ResponseCode !== "0") throw new Error(result.errorMessage || result.ResponseDescription || "M-Pesa payment request failed");
        await paymentAttemptModel.create({ orderId: order._id, provider: "mpesa", amountMinor: order.depositMinor, currency, checkoutRequestId: result.CheckoutRequestID, merchantRequestId: result.MerchantRequestID, phone });
        res.json({ success: true, message: "M-Pesa payment prompt sent", checkoutRequestId: result.CheckoutRequestID });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const mpesaCallback = async (req, res) => {
    const callback = req.body?.Body?.stkCallback;
    if (!callback?.CheckoutRequestID) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    const attempt = await paymentAttemptModel.findOne({ checkoutRequestId: callback.CheckoutRequestID });
    if (!attempt) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    if (callback.ResultCode !== 0) {
        await paymentAttemptModel.findByIdAndUpdate(attempt._id, { status: "failed", failureCode: String(callback.ResultCode) });
        await orderModel.findByIdAndUpdate(attempt.orderId, { paymentStatus: "failed" });
        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }
    const receipt = callback.CallbackMetadata?.Item?.find((item) => item.Name === "MpesaReceiptNumber")?.Value;
    const paidAmount = callback.CallbackMetadata?.Item?.find((item) => item.Name === "Amount")?.Value;
    const orderForVerification = await orderModel.findById(attempt.orderId).lean();
    if (!orderForVerification || Number(paidAmount) !== Math.ceil(orderForVerification.depositMinor / 100)) {
        await paymentAttemptModel.findByIdAndUpdate(attempt._id, { status: "failed", failureCode: "AMOUNT_MISMATCH" });
        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const currentAttempt = await paymentAttemptModel.findOneAndUpdate({ _id: attempt._id, status: "pending" }, { status: "paid", mpesaReceiptNumber: receipt, verifiedAt: new Date() }, { session, new: true });
            if (!currentAttempt) return;
            const reservation = await reservationModel.findOneAndUpdate(
                { orderId: attempt.orderId, status: "active", expiresAt: { $gt: new Date() } },
                { status: "consumed" },
                { session, new: true }
            );
            if (!reservation) {
                await paymentAttemptModel.updateOne({ _id: attempt._id }, { status: "expired", failureCode: "RESERVATION_EXPIRED" }, { session });
                return;
            }
            const order = await orderModel.findOneAndUpdate(
                { _id: attempt.orderId, paymentStatus: "pending" },
                { payment: true, paymentStatus: "paid", status: "Reservation Confirmed" },
                { session, new: true }
            );
            if (!order) return;
            for (const item of order.items) {
                await productModel.updateOne({ _id: item.productId, "variants._id": item.variantId }, { $inc: { "variants.$.reservedQuantity": -item.quantity, "variants.$.stockOnHand": -item.quantity } }, { session });
            }
            await userModel.findByIdAndUpdate(order.userId, { cartData: {} }, { session });
        });
    } finally {
        await session.endSession();
    }
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
};

export { quoteOrder, createReservationOrder, initiateMpesa, mpesaCallback };
