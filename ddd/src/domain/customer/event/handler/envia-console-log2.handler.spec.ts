import Address from "../../value-object/address";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog2Handler from "./envia-console-log2.handler";

describe("EnviaConsoleLog2Handler tests", () => {
  it("should handle a new event", () => {
    const eventHandler = new EnviaConsoleLog2Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const event = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
      address: new Address("Street", 1, "13330-250", "São Paulo"),
    });

    eventHandler.handle(event)
    
    expect(spyEventHandler).toHaveBeenCalled();
  });

});
