import express from "express";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.valueobject";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceModel from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import ProductModel from "../repository/product.model";
import { invoiceRoute } from "./invoice.route";

const app = express();
app.use(express.json());
app.use("/invoice", invoiceRoute);

describe("E2E test for product", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should get a invoice", async () => {
    const repository = new InvoiceRepository();
    const address = new Address(
      "Street 1",
      "Number 1",
      "Complement 1",
      "City 1",
      "State 1",
      "Zipcode 1"
    );
    const product1 = new Product({
      id: new Id("p1"),
      name: "Product 1",
      price: 1.55,
    });
    const product2 = new Product({
      id: new Id("p2"),
      name: "Product 2",
      price: 2.55,
    });
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: address,
      items: [product1, product2],
    });
    await repository.create(invoice);

    const response = await request(app).get("/invoice/1").send();
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Invoice 1");
    expect(response.body.document).toBe("Document 1");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe("Number 1");
  });
});
