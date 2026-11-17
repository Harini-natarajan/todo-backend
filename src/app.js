import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Todo API is running - Version 2");
});

app.use("/api/todos", todoRoutes);
app.use("/api/ai", aiRoutes);

export default app;