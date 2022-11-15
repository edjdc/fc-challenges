import express from "express";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { ClientModel } from "../repository/client.model";
import { clientRoute } from "./client.route";

const app = express();
app.use(express.json());
app.use("/clients", clientRoute);

describe("E2E test for client", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add a client", async () => {
    const response = await request(app).post("/clients").send({
      id: "c1",
      name: "Client 1",
      email: "client@gmail.com",
      address: "Address 1",
    });
    expect(response.status).toBe(201);
  });
});
