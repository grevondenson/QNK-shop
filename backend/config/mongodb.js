import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ MONGODB_URI is not set in backend/.env!");
        console.error("   Please set MONGODB_URI in backend/.env (e.g. mongodb+srv://... or mongodb://localhost:27017)");
        return;
    }

    mongoose.connection.on('connected', () => {
        console.log(`✅ MongoDB Connected successfully [Database: ${mongoose.connection.name || 'qnk_noire_bags'}]`);
    });

    mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected.');
    });

    try {
        const dbName = process.env.MONGODB_DB_NAME || 'qnk_noire_bags';
        
        // If URI is a standard string without dbName, Mongoose handles dbName option gracefully
        await mongoose.connect(uri, {
            dbName: dbName,
            serverSelectionTimeoutMS: 5000, // Fail fast (5s) rather than hanging 30s
        });
    } catch (error) {
        console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
        console.error("   Tip: Check your MongoDB connection string, network access, or Atlas IP whitelist (0.0.0.0/0).");
    }
}

export default connectDB;
