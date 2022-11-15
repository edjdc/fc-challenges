import express from "express";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { ProductModel } from "../repository/product.model";
import { productRoute } from "./product.route";

const app = express();
app.use(express.json());
app.use("/products", productRoute);

describe("E2E test for product", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add a product", async () => {
    const response = await request(app).post("/products").send({
      id: "p1",
      name: "Product 1",
      description: "Description p1",
      purchasePrice: 1.55,
      stock: 10,
    });
    expect(response.status).toBe(201);
    expect(response.body.id).toBe("p1");
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Description p1");
    expect(response.body.purchasePrice).toBe(1.55);
    expect(response.body.stock).toBe(10);
  });
});
