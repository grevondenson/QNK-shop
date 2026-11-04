import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, sparse: true },
    userId: { type: String, default: null },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    subtotalMinor: { type: Number, min: 0 },
    shippingMinor: { type: Number, min: 0 },
    depositMinor: { type: Number, min: 0 },
    currency: { type: String, uppercase: true, default: "KES" },
    address: { type: Object, required: true },
    status: { type: String, required: true, default:'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true , default: false },
    paymentStatus: { type: String, enum: ["unpaid", "pending", "paid", "failed", "expired"], default: "unpaid" },
    fulfilmentStatus: { type: String, enum: ["unfulfilled", "processing", "shipped", "delivered", "cancelled"], default: "unfulfilled" },
    date: {type: Number, required:true}
})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;