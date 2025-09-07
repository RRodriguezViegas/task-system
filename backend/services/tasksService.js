import { Sequelize } from "sequelize";
import Task from "../models/Task.js";

export async function getTasks({
  page = 1,
  limit = 5,
  sortBy = "createdAt",
  order = "ASC",
  status,
}) {
  const offset = (page - 1) * limit;

  const where = { parentId: null };
  if (status) {
    where.status = status;
  }

  const tasks = await Task.findAll({
    where,
    order:
      sortBy === "title"
        ? [[Sequelize.fn("lower", Sequelize.col("title")), order.toUpperCase()]]
        : [[sortBy, order.toUpperCase()]],
    limit,
    offset,
  });

  return tasks;
}

export async function createTask(data) {
  if (!data.title || data.title.trim() === "") {
    throw new Error("El título es obligatorio");
  }

  const task = await Task.create(data);
  return task;
}

export async function updateTask(id, data) {
  const task = await Task.findByPk(id, { include: "subtasks" });
  if (!task) throw new Error("Task not found");

  if (data.title !== undefined && (!data.title || data.title.trim() === "")) {
    throw new Error("Title cannot be empty");
  }

  if (
    data.estimate !== undefined &&
    (isNaN(data.estimate) || data.estimate < 0)
  ) {
    throw new Error("Estimate cannot be negative");
  }
  await task.update(data);
  return task;
}
