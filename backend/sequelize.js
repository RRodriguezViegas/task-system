import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

sequelize.query("PRAGMA foreign_keys = ON");

export default sequelize;
