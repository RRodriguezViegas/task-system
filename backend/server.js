import express from "express";
import sequelize from "./sequelize.js";
import Task from "./models/Task.js";
import cors from "cors";
import { getTasks, createTask, updateTask } from "./services/tasksService.js";

const app = express();
app.use(express.json());
app.use(cors());

// CREATE
app.post("/tasks", async (req, res) => {
  try {
    const task = await createTask(req.body);
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET ALL
app.get("/tasks", async (req, res) => {
  try {
    const { page, limit, sortBy, order, status } = req.query;
    const tasks = await getTasks({
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      order,
      status,
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET ONE
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, { include: "subtasks" });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE
app.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const start = async () => {
  await sequelize.sync();
  app.listen(3000, () =>
    console.log("El server está corriendo en http://localhost:3000")
  );
};
start();
