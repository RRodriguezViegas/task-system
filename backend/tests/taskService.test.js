import { getTasks, createTask, updateTask } from "../services/tasksService.js";
import Task from "../models/Task.js";

jest.mock("../models/Task.js");

describe("getTasks service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve tareas ordenadas por título", async () => {
    Task.findAll.mockResolvedValue([{ title: "abc" }, { title: "XYZ" }]);

    const tasks = await getTasks({ sortBy: "title", order: "ASC" });

    expect(Task.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        order: [[expect.anything(), "ASC"]],
      })
    );

    expect(tasks).toEqual([{ title: "abc" }, { title: "XYZ" }]);
  });

  test("filtra por estado si se pasa un valor", async () => {
    Task.findAll.mockResolvedValue([{ title: "Hola", status: "UNSTARTED" }]);

    const tasks = await getTasks({ status: "UNSTARTED" });

    expect(Task.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { parentId: null, status: "UNSTARTED" },
      })
    );

    expect(tasks[0].status).toBe("UNSTARTED");
  });
});

describe("createTask service", () => {
  test("lanza error si el título está vacío", async () => {
    await expect(createTask({ title: "" })).rejects.toThrow(
      "El título es obligatorio"
    );
  });

  test("crea tarea pasando solo el título", async () => {
    const mockTask = { id: 1, title: "Hola" };
    Task.create.mockResolvedValue(mockTask);

    const task = await createTask({ title: "Hola" });

    expect(Task.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Hola" })
    );

    expect(task).toEqual(mockTask);
  });
});

describe("updateTask service", () => {
  test("no permite actualizar a título vacío", async () => {
    const mockTask = { update: jest.fn() };
    Task.findByPk.mockResolvedValue(mockTask);

    await expect(updateTask(1, { title: "" })).rejects.toThrow(
      "Title cannot be empty"
    );

    await expect(updateTask(1, { title: "   " })).rejects.toThrow(
      "Title cannot be empty"
    );

    expect(mockTask.update).not.toHaveBeenCalled();
  });

  test("no permite actualizar estimate a valor negativo", async () => {
    const mockTask = { update: jest.fn() };
    Task.findByPk.mockResolvedValue(mockTask);

    await expect(updateTask(1, { estimate: -5 })).rejects.toThrow(
      "Estimate cannot be negative"
    );

    expect(mockTask.update).not.toHaveBeenCalled();
  });
});
