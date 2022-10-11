import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle({eventData}: CustomerAddressChangedEvent): void {
    const id = eventData.id;
    const name = eventData.name;
    const address = eventData.address.toString()
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`); 
  }
}
