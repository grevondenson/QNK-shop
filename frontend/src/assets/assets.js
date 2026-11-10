import p_img1 from './p_img1.png'
import p_img2_1 from './p_img2_1.png'
import p_img2_2 from './p_img2_2.png'
import p_img2_3 from './p_img2_3.png'
import p_img2_4 from './p_img2_4.png'
import p_img3 from './p_img3.png'
import p_img4 from './p_img4.png'
import p_img5 from './p_img5.png'
import p_img6 from './p_img6.png'
import p_img7 from './p_img7.png'
import p_img8 from './p_img8.png'
import p_img9 from './p_img9.png'
import p_img10 from './p_img10.png'
import p_img11 from './p_img11.png'
import p_img12 from './p_img12.png'
import p_img13 from './p_img13.png'
import p_img14 from './p_img14.png'
import p_img15 from './p_img15.png'
import p_img16 from './p_img16.png'
import p_img17 from './p_img17.png'
import p_img18 from './p_img18.png'
import p_img19 from './p_img19.png'
import p_img20 from './p_img20.png'
import p_img21 from './p_img21.png'
import p_img22 from './p_img22.png'
import p_img23 from './p_img23.png'
import p_img24 from './p_img24.png'
import p_img25 from './p_img25.png'
import p_img26 from './p_img26.png'
import p_img27 from './p_img27.png'
import p_img28 from './p_img28.png'
import p_img29 from './p_img29.png'
import p_img30 from './p_img30.png'
import p_img31 from './p_img31.png'
import p_img32 from './p_img32.png'
import p_img33 from './p_img33.png'
import p_img34 from './p_img34.png'
import p_img35 from './p_img35.png'
import p_img36 from './p_img36.png'
import p_img37 from './p_img37.png'
import p_img38 from './p_img38.png'
import p_img39 from './p_img39.png'
import p_img40 from './p_img40.png'
import p_img41 from './p_img41.png'
import p_img42 from './p_img42.png'
import p_img43 from './p_img43.png'
import p_img44 from './p_img44.png'
import p_img45 from './p_img45.png'
import p_img46 from './p_img46.png'
import p_img47 from './p_img47.png'
import p_img48 from './p_img48.png'
import p_img49 from './p_img49.png'
import p_img50 from './p_img50.png'
import p_img51 from './p_img51.png'
import p_img52 from './p_img52.png'

import logo from './logo.png'
import hero_img from './hero_img.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon
}

export const products = [
    {
        _id: "qnk-bag-001",
        name: "Noire Classic Shoulder Bag",
        description: "A sculpted, minimal shoulder bag designed in smooth vegan leather with an effortless under-arm curve. Features gold-toned magnetic closure and interior slip pocket.",
        price: 4800,
        image: [p_img1],
        category: "Shoulder Bags",
        subCategory: "Vegan Leather",
        date: 1716634345448,
        bestseller: true,
        variants: [
            {
                _id: "var-001-noir",
                sku: "QNK-SB-NOIR",
                colour: "Noir Black",
                material: "Vegan Leather",
                dimensions: "26 x 15 x 6 cm",
                priceMinor: 480000,
                stockOnHand: 8,
                reservedQuantity: 0,
                active: true
            },
            {
                _id: "var-001-sand",
                sku: "QNK-SB-SAND",
                colour: "Warm Sand",
                material: "Vegan Leather",
                dimensions: "26 x 15 x 6 cm",
                priceMinor: 480000,
                stockOnHand: 5,
                reservedQuantity: 0,
                active: true
            }
        ]
    },
    {
        _id: "qnk-bag-002",
        name: "Saddle Tan Daily Structured Tote",
        description: "An elegant, roomy tote crafted for work-to-weekend transition. Thoughtful structure keeps its shape with dedicated space for laptop, diary, and essentials.",
        price: 6500,
        image: [p_img2_1, p_img2_2, p_img2_3, p_img2_4],
        category: "Tote Bags",
        subCategory: "Pebble Grain",
        date: 1716634445448,
        bestseller: true,
        variants: [
            {
                _id: "var-002-saddle",
                sku: "QNK-TT-SADDLE",
                colour: "Saddle Tan",
                material: "Pebble Grain",
                dimensions: "36 x 28 x 12 cm",
                priceMinor: 650000,
                stockOnHand: 6,
                reservedQuantity: 0,
                active: true
            },
            {
                _id: "var-002-noir",
                sku: "QNK-TT-NOIR",
                colour: "Noir Black",
                material: "Pebble Grain",
                dimensions: "36 x 28 x 12 cm",
                priceMinor: 650000,
                stockOnHand: 4,
                reservedQuantity: 0,
                active: true
            }
        ]
    },
    {
        _id: "qnk-bag-003",
        name: "Olive Sage Minimalist Crossbody",
        description: "Compact yet surprisingly spacious crossbody bag featuring an adjustable strap, brass hardware, and a subtle botanical aesthetic inspired by organic earth tones.",
        price: 3950,
        image: [p_img3],
        category: "Crossbody",
        subCategory: "Vegan Leather",
        date: 1716634545448,
        bestseller: true,
        variants: [
            {
                _id: "var-003-olive",
                sku: "QNK-CB-OLIVE",
                colour: "Olive Sage",
                material: "Vegan Leather",
                dimensions: "22 x 16 x 7 cm",
                priceMinor: 395000,
                stockOnHand: 10,
                reservedQuantity: 0,
                active: true
            },
            {
                _id: "var-003-stone",
                sku: "QNK-CB-STONE",
                colour: "Warm Stone",
                material: "Vegan Leather",
                dimensions: "22 x 16 x 7 cm",
                priceMinor: 395000,
                stockOnHand: 7,
                reservedQuantity: 0,
                active: true
            }
        ]
    },
    {
        _id: "qnk-bag-004",
        name: "Pebble Grain Crescent Handbag",
        description: "A modern half-moon silhouette with textured pebble finish. Accented with comfortable top handle and an attachable crossbody strap for versatile styling.",
        price: 5200,
        image: [p_img4],
        category: "Shoulder Bags",
        subCategory: "Pebble Grain",
        date: 1716634645448,
        bestseller: false,
        variants: [
            {
                _id: "var-004-cream",
                sku: "QNK-CR-CREAM",
                colour: "Cream Off-White",
                material: "Pebble Grain",
                dimensions: "28 x 18 x 8 cm",
                priceMinor: 520000,
                stockOnHand: 6,
                reservedQuantity: 0,
                active: true
            },
            {
                _id: "var-004-tan",
                sku: "QNK-CR-TAN",
                colour: "Saddle Tan",
                material: "Pebble Grain",
                dimensions: "28 x 18 x 8 cm",
                priceMinor: 520000,
                stockOnHand: 3,
                reservedQuantity: 0,
                active: true
            }
        ]
    },
    {
        _id: "qnk-bag-005",
        name: "Earthy Canvas & Leather Trim Shopper",
        description: "Heavyweight organic cotton canvas reinforced with supple vegan leather trim. Perfect for market strolls, beach weekends, or relaxed city outings.",
        price: 4400,
        image: [p_img5],
        category: "Tote Bags",
        subCategory: "Canvas",
        date: 1716634745448,
        bestseller: true,
        variants: [
            {
                _id: "var-005-canvas-tan",
                sku: "QNK-CV-TAN",
                colour: "Natural / Saddle",
                material: "Canvas",
                dimensions: "40 x 32 x 14 cm",
                priceMinor: 440000,
                stockOnHand: 12,
                reservedQuantity: 0,
                active: true
            },
            {
                _id: "var-005-canvas-noir",
                sku: "QNK-CV-NOIR",
                colour: "Natural / Noir",
                material: "Canvas",
                dimensions: "40 x 32 x 14 cm",
                priceMinor: 440000,
                stockOnHand: 8,
                reservedQuantity: 0,
                active: true
            }
        ]
    },
    {
        _id: "qnk-bag-006",
        name: "Petite Envelope Evening Clutch",
        description: "Sleek and understated evening clutch designed for dinners and gallery nights. Accompanied by a detachable delicate chain in muted antique gold.",
        price: 3600,
        image: [p_img6],
        category: "Crossbody",
        subCategory: "Vegan Leather",
        date: 1716634845448,
        bestseller: false,
        variants: [
            {
                _id: "var-006-noir",
                sku: "QNK-CL-NOIR",
                colour: "Noir Black",
                material: "Vegan Leather",
                dimensions: "24 x 14 x 4 cm",
                priceMinor: 360000,
                stockOnHand: 9,
                reservedQuantity: 0,
                active: true
            },
            {
                _id: "var-006-sand",
                sku: "QNK-CL-SAND",
                colour: "Warm Sand",
                material: "Vegan Leather",
                dimensions: "24 x 14 x 4 cm",
                priceMinor: 360000,
                stockOnHand: 5,
                reservedQuantity: 0,
                active: true
            }
        ]
    },
    {
        _id: "qnk-bag-007",
        name: "Structured Box Bag in Warm Stone",
        description: "Architectural box silhouette with magnetic clasp and custom debossed branding. A bold accent piece that pairs effortlessly with tailored neutrals.",
        price: 5800,
        image: [p_img7],
        category: "Crossbody",
        subCategory: "Pebble Grain",
        date: 1716634945448,
        bestseller: true,
        variants: [
            {
                _id: "var-007-stone",
                sku: "QNK-BX-STONE",
                colour: "Warm Stone",
                material: "Pebble Grain",
                dimensions: "20 x 17 x 8 cm",
                priceMinor: 580000,
                stockOnHand: 4,
                reservedQuantity: 0,
                active: true
            }
        ]
    },
    {
        _id: "qnk-bag-008",
        name: "Slouchy Hobo Bag in Saddle Brown",
        description: "Relaxed bohemian hobo bag with a soft drape, wide ergonomic strap, and secure zip closure. Designed to carry your world with zero fuss.",
        price: 5400,
        image: [p_img8],
        category: "Shoulder Bags",
        subCategory: "Vegan Leather",
        date: 1716635045448,
        bestseller: false,
        variants: [
            {
                _id: "var-008-saddle",
                sku: "QNK-HB-SADDLE",
                colour: "Saddle Tan",
                material: "Vegan Leather",
                dimensions: "34 x 26 x 10 cm",
                priceMinor: 540000,
                stockOnHand: 7,
                reservedQuantity: 0,
                active: true
            }
        ]
    }
]
