import Address from "../../value-object/address";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import EnviaConsoleLogHandler from "./envia-console-log.handler";

describe("EnviaConsoleLogHandler tests", () => {
  it("should handle a new event", () => {
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const event = new CustomerAddressChangedEvent({
      id: "1",
      name: "Customer 1",
      address: new Address("Street", 1, "13330-250", "São Paulo"),
    });

    eventHandler.handle(event)

    expect(spyEventHandler).toHaveBeenCalled();
  });

});
