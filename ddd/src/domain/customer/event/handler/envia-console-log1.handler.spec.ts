import Address from "../../value-object/address";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1Handler from "./envia-console-log1.handler";

describe("EnviaConsoleLog1Handler tests", () => {
  it("should handle a new event", () => {
    const eventHandler = new EnviaConsoleLog1Handler();
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
