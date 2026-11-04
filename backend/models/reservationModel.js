import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true, unique: true },
    items: [{
        variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    status: { type: String, enum: ["active", "consumed", "released", "expired"], default: "active" },
    expiresAt: { type: Date, required: true, index: true }
}, { timestamps: true });

const reservationModel = mongoose.models.reservation || mongoose.model("reservation", reservationSchema);

export default reservationModel;
