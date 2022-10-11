import EventInterface from "../../@shared/event/event.interface";
import Address from "../value-object/address";

type EventDataType = {
  id: string,
  name: string,
  address: Address
}

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: EventDataType;

  constructor(eventData: EventDataType) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
