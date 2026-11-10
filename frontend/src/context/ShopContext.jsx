import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { products as initialProducts } from '../assets/assets';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'KES ';
    const delivery_fee = 500; // 500 KES standard courier delivery in Kenya
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('qnk_guest_cart') || '{}');
        } catch {
            return {};
        }
    });
    const [products, setProducts] = useState(initialProducts);
    const [token, setToken] = useState('')
    const navigate = useNavigate();

    const addToCart = async (itemId, variantId) => {

        if (!variantId) {
            toast.error('Select a colour and material');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][variantId]) {
                cartData[itemId][variantId] += 1;
            }
            else {
                cartData[itemId][variantId] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][variantId] = 1;
        }
        setCartItems(cartData);
        toast.success('Added to bag');

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size: variantId }, { headers: { token } })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, variantId, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][variantId] = quantity;

        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size: variantId, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        const variant = itemInfo.variants?.find((v) => v._id === item);
                        const unitPrice = variant ? (variant.priceMinor / 100) : itemInfo.price;
                        totalAmount += unitPrice * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success && response.data.products?.length > 0) {
                setProducts(response.data.products.reverse())
            }
        } catch (error) {
            // Keep initial curated bag products gracefully
            console.info("Using curated local catalogue while API connects.");
        }
    }

    const getUserCart = async ( token ) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        localStorage.setItem('qnk_guest_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
