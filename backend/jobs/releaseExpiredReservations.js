import mongoose from "mongoose";
import reservationModel from "../models/reservationModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import paymentAttemptModel from "../models/paymentAttemptModel.js";

// Run this from a durable scheduler/worker; it is intentionally not an in-process timer.
const releaseExpiredReservations = async () => {
    const reservations = await reservationModel.find({ status: "active", expiresAt: { $lte: new Date() } }).limit(100);
    for (const reservation of reservations) {
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const current = await reservationModel.findOneAndUpdate(
                    { _id: reservation._id, status: "active" },
                    { status: "expired" },
                    { session, new: true }
                );
                if (!current) return;
                const order = await orderModel.findById(reservation.orderId).session(session);
                if (order) await orderModel.updateOne({ _id: order._id, paymentStatus: { $ne: "paid" } }, { paymentStatus: "expired", status: "Reservation Expired" }, { session });
                await paymentAttemptModel.updateMany(
                    { orderId: reservation.orderId, status: "pending" },
                    { status: "expired", failureCode: "RESERVATION_EXPIRED" },
                    { session }
                );
                for (const item of reservation.items) {
                    if (order) {
                        await productModel.updateOne({ _id: order.items.find((line) => line.variantId.toString() === item.variantId.toString())?.productId, "variants._id": item.variantId }, { $inc: { "variants.$.reservedQuantity": -item.quantity } }, { session });
                    }
                }
            });
        } finally {
            await session.endSession();
        }
    }
    return reservations.length;
};

export default releaseExpiredReservations;
