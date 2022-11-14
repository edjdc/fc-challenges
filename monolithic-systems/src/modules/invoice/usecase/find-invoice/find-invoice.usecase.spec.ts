import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.valueobject";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

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

const MockRepository = () => {
  return {
    create: jest.fn(),
    findById: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice usecase unit test", () => {
  it("should generate a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = { id: "1" };

    const output = await usecase.execute(input);

    expect(invoiceRepository.findById).toHaveBeenCalled();
    expect(output).toBeDefined();
    expect(output.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.address.street).toBe(address.street);
    expect(output.address.number).toBe(address.number);
    expect(output.address.complement).toBe(address.complement);
    expect(output.address.city).toBe(address.city);
    expect(output.address.state).toBe(address.state);
    expect(output.address.zipCode).toBe(address.zipcode);
    expect(output.items.length).toBe(invoice.items.length);
    expect(output.items[0].id).toBe(invoice.items[0].id.id);
    expect(output.items[0].name).toBe(invoice.items[0].name);
    expect(output.items[0].price).toBe(invoice.items[0].price);
    expect(output.items[1].id).toBe(invoice.items[1].id.id);
    expect(output.items[1].name).toBe(invoice.items[1].name);
    expect(output.items[1].price).toBe(invoice.items[1].price);
  });
});
