import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.valueobject";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import ProductModel from "./product.model";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();
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
    await invoiceRepository.create(invoice);

    const invoiceModel = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
    });

    const items = await ProductModel.findAll({
      where: { invoiceId: invoice.id.id },
    });

    expect(invoiceModel.id).toBe(invoice.id.id);
    expect(invoiceModel.name).toBe(invoice.name);
    expect(invoiceModel.document).toBe(invoice.document);
    expect(invoiceModel.street).toBe(invoice.address.street);
    expect(invoiceModel.number).toBe(invoice.address.number);
    expect(invoiceModel.complement).toBe(invoice.address.complement);
    expect(invoiceModel.city).toBe(invoice.address.city);
    expect(invoiceModel.state).toBe(invoice.address.state);
    expect(invoiceModel.zipcode).toBe(invoice.address.zipcode);
    expect(items.length).toBe(2);
    expect(items[0].id).toBe(product1.id.id);
    expect(items[0].name).toBe(product1.name);
    expect(items[0].price).toBe(product1.price);
    expect(items[1].id).toBe(product2.id.id);
    expect(items[1].name).toBe(product2.name);
    expect(items[1].price).toBe(product2.price);
  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();
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
    await invoiceRepository.create(invoice);

    const output = await invoiceRepository.findById(invoice.id.id);

    expect(output.id.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.address.street).toBe(invoice.address.street);
    expect(output.address.number).toBe(invoice.address.number);
    expect(output.address.complement).toBe(invoice.address.complement);
    expect(output.address.city).toBe(invoice.address.city);
    expect(output.address.state).toBe(invoice.address.state);
    expect(output.address.zipcode).toBe(invoice.address.zipcode);
    expect(output.items.length).toBe(2);
    expect(output.items[0].id.id).toBe(product1.id.id);
    expect(output.items[0].name).toBe(product1.name);
    expect(output.items[0].price).toBe(product1.price);
    expect(output.items[1].id.id).toBe(product2.id.id);
    expect(output.items[1].name).toBe(product2.name);
    expect(output.items[1].price).toBe(product2.price);
  });
});
