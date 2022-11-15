import express from "express";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import TransactionModel from "../repository/transaction.model";
import { paymentRoute } from "./payment.route";

const app = express();
app.use(express.json());
app.use("/checkout", paymentRoute);

describe("E2E test for payment", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should process a payment", async () => {
    const response = await request(app).post("/checkout").send({
      orderId: "order-1",
      amount: 100,
    });
    expect(response.status).toBe(200);
    expect(response.body.transactionId).toBeDefined();
    expect(response.body.orderId).toBe("order-1");
    expect(response.body.amount).toBe(100);
    expect(response.body.status).toBe("approved");
  });
});
