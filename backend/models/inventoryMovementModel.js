import mongoose from "mongoose";

const inventoryMovementSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["receipt", "adjustment", "sale", "return"], required: true },
    quantityDelta: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    actorId: { type: String, default: null }
}, { timestamps: true });

inventoryMovementSchema.index({ productId: 1, variantId: 1, createdAt: -1 });

const inventoryMovementModel = mongoose.models.inventoryMovement || mongoose.model("inventoryMovement", inventoryMovementSchema);

export default inventoryMovementModel;
