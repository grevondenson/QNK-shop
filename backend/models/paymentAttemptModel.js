import mongoose from "mongoose";

const paymentAttemptSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
    provider: { type: String, enum: ["mpesa"], required: true },
    amountMinor: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, uppercase: true },
    status: { type: String, enum: ["pending", "paid", "failed", "expired"], default: "pending" },
    checkoutRequestId: { type: String, unique: true, sparse: true },
    merchantRequestId: { type: String },
    mpesaReceiptNumber: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true },
    failureCode: { type: String },
    verifiedAt: { type: Date }
}, { timestamps: true });

paymentAttemptSchema.index({ orderId: 1, createdAt: -1 });

const paymentAttemptModel = mongoose.models.paymentAttempt || mongoose.model("paymentAttempt", paymentAttemptSchema);

export default paymentAttemptModel;
