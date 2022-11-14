import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.valueobject";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

export default class InvoiceRepository implements InvoiceGateway {
  async create(entity: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: entity.id.id,
      name: entity.name,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipcode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
    await ProductModel.bulkCreate(
      entity.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoiceId: entity.id.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
    );
  }

  async findById(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findOne({
      where: { id: id },
    });
    const itemsModel = await ProductModel.findAll({
      where: { invoiceId: id },
    });

    const address = new Address(
      invoiceModel.street,
      invoiceModel.number,
      invoiceModel.complement,
      invoiceModel.city,
      invoiceModel.state,
      invoiceModel.zipcode
    );
    const items = itemsModel.map((item) => {
      return new Product({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      });
    });
    const invoice = new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address,
      items: items,
    });

    return invoice;
  }
}
