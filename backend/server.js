import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())

// CORS configuration
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS 
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim()) 
    : defaultOrigins

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(new Error(`CORS origin ${origin} not allowed`));
    },
    credentials: true
}))

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Health & status endpoint
app.get('/api/health', (req, res) => {
    const mongoStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
    res.json({
        success: true,
        service: 'qnk-noire-bags-backend',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mongodb: mongoStates[mongoose.connection.readyState] || 'unknown',
        database: mongoose.connection.name || null
    })
})

app.get('/', (req, res) => {
    res.send("QNK Noire Bags API Running")
})

app.listen(port, () => console.log(`🚀 QNK Noire Bags API running on PORT: ${port}`))
