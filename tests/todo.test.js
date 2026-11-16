import { jest } from "@jest/globals";
import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";


import app from "../src/app.js";
import Todo from "../src/models/Todo.js";

describe("Todo API Testing with MongoDB", () => {

    // Connect to test database before running tests
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_TEST_URI);
    });

    // Clear test data before every test
    beforeEach(async () => {
        await Todo.deleteMany({});
    });

    // Close database connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // 1. GET ALL TODOS
    test("Should return all todos", async () => {
        const response = await request(app)
            .get("/api/todos");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    // 2. CREATE TODO
    test("Should create a new todo", async () => {
        const response = await request(app)
            .post("/api/todos")
            .send({ title: "Learn Jest" });

        expect(response.statusCode).toBe(201);
        expect(response.body.todo.title).toBe("Learn Jest");
        expect(response.body.todo.completed).toBe(false);
    });

    // 3. REJECT EMPTY TITLE
    test("Should reject todo without title", async () => {
        const response = await request(app)
            .post("/api/todos")
            .send({ title: "" });

        expect(response.statusCode).toBe(400);
    });

    // 4. UPDATE TODO
    test("Should update an existing todo", async () => {
        const created = await request(app)
            .post("/api/todos")
            .send({ title: "Learn React" });

        const id = created.body.todo._id;

        const response = await request(app)
            .put(`/api/todos/${id}`)
            .send({
                title: "Learn MERN",
                completed: true
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.todo.title).toBe("Learn MERN");
        expect(response.body.todo.completed).toBe(true);
    });

    // 5. REJECT INVALID COMPLETED VALUE
    test("Should reject invalid completed value", async () => {
        const created = await request(app)
            .post("/api/todos")
            .send({ title: "Learn React" });

        const id = created.body.todo._id;

        const response = await request(app)
            .put(`/api/todos/${id}`)
            .send({ completed: "yes" });

        expect(response.statusCode).toBe(400);
    });

    // 6. DELETE SINGLE TODO
    test("Should delete an existing todo", async () => {
        const created = await request(app)
            .post("/api/todos")
            .send({ title: "Learn Express" });

        const id = created.body.todo._id;

        const response = await request(app)
            .delete(`/api/todos/${id}`);

        expect(response.statusCode).toBe(200);

        const remainingTodos = await Todo.countDocuments();
        expect(remainingTodos).toBe(0);
    });

    // 7. CLEAR ALL TODOS
    test("Should clear all todos", async () => {
        await request(app)
            .post("/api/todos")
            .send({ title: "Learn React" });

        await request(app)
            .post("/api/todos")
            .send({ title: "Learn Node" });

        const response = await request(app)
            .delete("/api/todos");

        expect(response.statusCode).toBe(200);

        const remainingTodos = await Todo.countDocuments();
        expect(remainingTodos).toBe(0);
    });

    // 8. GET TODO WITH INVALID ID
    test("Should return 404 for invalid todo ID", async () => {
        const response = await request(app)
            .get("/api/todos/999");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Todo not found");
    });

    // 9. UPDATE TODO WITH INVALID ID
    test("Should return 404 when updating invalid todo ID", async () => {
        const response = await request(app)
            .put("/api/todos/999")
            .send({
                title: "Learn MERN",
                completed: true
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Todo not found");
    });

    // 10. REJECT SPACES ONLY
    test("Should reject todo with only spaces", async () => {
        const response = await request(app)
            .post("/api/todos")
            .send({ title: "     " });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Todo title is required");
    });

    test("Should reject invalid title during update", async () => {
    const created = await request(app)
        .post("/api/todos")
        .send({ title: "Learn React" });

    const id = created.body.todo._id;

    const response = await request(app)
        .put(`/api/todos/${id}`)
        .send({ title: "   " });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Valid title is required");
});

test("Should return 404 for invalid MongoDB ID format", async () => {
    const response = await request(app)
        .get("/api/todos/invalid-id");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Todo not found");
});

test("Should return 404 when deleting non-existing todo", async () => {
    const response = await request(app)
        .delete("/api/todos/507f1f77bcf86cd799439011");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Todo not found");
});

afterEach(() => {
    jest.restoreAllMocks();
});

test("Should return 500 if database fails during creation", async () => {

    jest.spyOn(Todo, "create")
        .mockRejectedValue(new Error("Database error"));

    const response = await request(app)
        .post("/api/todos")
        .send({
            title: "Learn Jest"
        });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
});

test("Should return 500 if database fails while fetching todos", async () => {

    jest.spyOn(Todo, "find")
        .mockRejectedValue(new Error("Database error"));

    const response = await request(app)
        .get("/api/todos");

    expect(response.statusCode).toBe(500);

    expect(response.body.message).toBe("Database error");
});



});
