import express from 'express'
import { allOrders, userOrders, updateStatus } from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import { quoteOrder, createReservationOrder, initiateMpesa, mpesaCallback } from '../controllers/checkoutController.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// User Feature 
orderRouter.post('/userorders',authUser,userOrders)
orderRouter.post('/quote', quoteOrder)
orderRouter.post('/reserve', authUser, createReservationOrder)
orderRouter.post('/mpesa/initiate', authUser, initiateMpesa)
orderRouter.post('/mpesa/callback', mpesaCallback)

export default orderRouter