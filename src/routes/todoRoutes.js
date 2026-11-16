
import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// 1. CREATE TODO
router.post("/", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Todo title is required"
            });
        }

        const newTodo = await Todo.create({
            title: title.trim()
        });

        res.status(201).json({
            message: "Todo created successfully",
            todo: newTodo
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET ALL TODOS
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();

        res.status(200).json(todos);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. GET SINGLE TODO
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json(todo);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(500).json({ message: error.message });
    }
});

// 4. UPDATE TODO
router.put("/:id", async (req, res) => {
    try {
        const { title, completed } = req.body;

        if (title !== undefined &&
            (typeof title !== "string" || !title.trim())) {
            return res.status(400).json({
                message: "Valid title is required"
            });
        }

        if (completed !== undefined &&
            typeof completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be true or false"
            });
        }

        const updates = {};

        if (title !== undefined) {
            updates.title = title.trim();
        }

        if (completed !== undefined) {
            updates.completed = completed;
        }

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                
                    returnDocument: "after",
                    runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(500).json({ message: error.message });
    }
});

// 5. DELETE SINGLE TODO
router.delete("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully"
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(500).json({ message: error.message });
    }
});

// 6. CLEAR ALL TODOS
router.delete("/", async (req, res) => {
    try {
        await Todo.deleteMany({});

        res.status(200).json({
            message: "All todos cleared successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, completed } = req.body;

        if (title !== undefined &&
            (typeof title !== "string" || !title.trim())) {
            return res.status(400).json({
                message: "Valid title is required"
            });
        }

        if (completed !== undefined &&
            typeof completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be true or false"
            });
        }

        const updates = {};

        if (title !== undefined) {
            updates.title = title.trim();
        }

        if (completed !== undefined) {
            updates.completed = completed;
        }

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(500).json({ message: error.message });
    }
});

export default router;
