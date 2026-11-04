import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, variantId } = req.body
        if (!itemId || !variantId) return res.json({ success: false, message: "Product variant is required" })

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][variantId]) {
                cartData[itemId][variantId] += 1
            }
            else {
                cartData[itemId][variantId] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][variantId] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId ,itemId, variantId, quantity } = req.body
        if (!itemId || !variantId || !Number.isInteger(Number(quantity)) || Number(quantity) < 0) return res.json({ success: false, message: "Valid product quantity is required" })

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (quantity === 0) {
            delete cartData[itemId][variantId]
            if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId]
        } else {
            cartData[itemId][variantId] = quantity
        }

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }