import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";
import Invoice from "../../domain/invoice.entity";
import Address from "../../domain/address.valueobject";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    );
    const items = input.items.map((item) => {
      return new Product({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      });
    });
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: address,
      items: items,
    });
    await this._invoiceRepository.create(invoice);
    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipcode,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total(),
    };
  }
}
