
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 5000;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Server startup failed:", error.message);
    }
};

startServer();