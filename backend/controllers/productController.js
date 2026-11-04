import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import inventoryMovementModel from "../models/inventoryMovementModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, slug, category, subCategory, materials, colours, variants, bestseller, status } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const parsedVariants = JSON.parse(variants || "[]");
        if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
            return res.json({ success: false, message: "At least one bag variant is required" });
        }
        if (parsedVariants.some((variant) => !variant.sku || !variant.colour || !variant.material || Number(variant.priceMinor) < 0 || Number(variant.stockOnHand) < 0)) {
            return res.json({ success: false, message: "Each variant needs a SKU, colour, material, valid price, and stock count" });
        }

        const productData = {
            name,
            description,
            slug: slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            category,
            subCategory,
            materials: JSON.parse(materials || "[]"),
            colours: JSON.parse(colours || "[]"),
            variants: parsedVariants.map((variant) => ({
                ...variant,
                priceMinor: Number(variant.priceMinor),
                stockOnHand: Number(variant.stockOnHand),
                reservedQuantity: 0
            })),
            bestseller: bestseller === "true" ? true : false,
            image: imagesUrl,
            status: status || "draft"
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({ status: "active" }).sort({ date: -1 });
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndUpdate(req.body.id, { status: "archived" })
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findOne({ _id: productId, status: "active" })
        if (!product) return res.json({ success: false, message: "Product not found" })
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const adjustStock = async (req, res) => {
    try {
        const { productId, variantId, quantityDelta, reason } = req.body;
        const delta = Number(quantityDelta);
        if (!productId || !variantId || !Number.isInteger(delta) || delta === 0) {
            return res.json({ success: false, message: "A non-zero whole-number stock adjustment is required" });
        }

        const product = await productModel.findOneAndUpdate(
            { _id: productId, "variants._id": variantId, "variants.stockOnHand": { $gte: delta < 0 ? Math.abs(delta) : 0 } },
            { $inc: { "variants.$.stockOnHand": delta } },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.json({ success: false, message: "Stock adjustment would create an invalid inventory balance" });
        }
        await inventoryMovementModel.create({
            productId,
            variantId,
            type: delta > 0 ? "receipt" : "adjustment",
            quantityDelta: delta,
            reason: reason || "Admin stock adjustment",
            actorId: req.userId || null
        });
        res.json({ success: true, message: `Stock updated${reason ? `: ${reason}` : ""}`, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, adjustStock }