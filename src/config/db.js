import mongoose from "mongoose";

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectDB;