import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Task = sequelize.define("Task", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  priority: { type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT") },
  status: {
    type: DataTypes.ENUM(
      "BACKLOG",
      "UNSTARTED",
      "STARTED",
      "COMPLETED",
      "CANCELED"
    ),
    defaultValue: "BACKLOG",
  },
  estimate: { type: DataTypes.INTEGER, defaultValue: 0 },
});

Task.hasMany(Task, {
  as: "subtasks",
  foreignKey: "parentId",
  onDelete: "CASCADE",
});
Task.belongsTo(Task, {
  as: "parent",
  foreignKey: "parentId",
  onDelete: "CASCADE",
});

export default Task;
