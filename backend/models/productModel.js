import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    sku: { type: String, required: true, trim: true, uppercase: true },
    colour: { type: String, required: true, trim: true },
    material: { type: String, required: true, trim: true },
    dimensions: { type: String, trim: true, default: "" },
    capacity: { type: String, trim: true, default: "" },
    priceMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, default: "KES" },
    stockOnHand: { type: Number, required: true, min: 0, default: 0 },
    reservedQuantity: { type: Number, required: true, min: 0, default: 0 },
    active: { type: Boolean, default: true }
}, { _id: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    image: { type: [String], required: true, default: [] },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    materials: { type: [String], default: [] },
    colours: { type: [String], default: [] },
    variants: { type: [variantSchema], required: true, default: [] },
    bestseller: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft" },
    date: { type: Number, default: () => Date.now() }
}, { timestamps: true });

productSchema.virtual("price").get(function () {
    return this.variants.length ? Math.min(...this.variants.map((variant) => variant.priceMinor)) / 100 : 0;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.index({ category: 1, subCategory: 1, status: 1 });
productSchema.index({ "variants.sku": 1 }, { unique: true });

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel