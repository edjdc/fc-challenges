import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.valueobject";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceModel from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import ProductModel from "../repository/product.model";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";

describe("InvoiceFacade test", () => {
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

  it("should generate a invoice", async () => {
    const repository = new InvoiceRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUseCase: undefined,
    });

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "123",
      items: [
        { id: "p1", name: "Product 1", price: 1.55 },
        { id: "p2", name: "Product 2", price: 2.05 },
      ],
    };

    const output = await facade.generate(input);

    expect(output).toBeDefined();
    expect(output.id).toBeDefined;
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items.length).toBe(input.items.length);
    expect(output.items[0].id).toBe(input.items[0].id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBe(input.items[1].id);
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
  });

  it("should find a invoice", async () => {
    const repository = new InvoiceRepository();
    const findUsecase = new FindInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUsecase: undefined,
      findUseCase: findUsecase,
    });

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

    const input = { id: "1" };
    const output = await facade.find(input);

    expect(output).toBeDefined();
    expect(output.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.address.street).toBe(invoice.address.street);
    expect(output.address.number).toBe(invoice.address.number);
    expect(output.address.complement).toBe(invoice.address.complement);
    expect(output.address.city).toBe(invoice.address.city);
    expect(output.address.state).toBe(invoice.address.state);
    expect(output.address.zipCode).toBe(invoice.address.zipcode);
    expect(output.items.length).toBe(2);
    expect(output.items[0].id).toBe(product1.id.id);
    expect(output.items[0].name).toBe(product1.name);
    expect(output.items[0].price).toBe(product1.price);
    expect(output.items[1].id).toBe(product2.id.id);
    expect(output.items[1].name).toBe(product2.name);
    expect(output.items[1].price).toBe(product2.price);
  });
});
