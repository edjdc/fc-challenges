import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../factory/facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create();
  try {
    const input = { id: req.params.id };
    const output = await invoiceFacade.find(input);
    res.status(200).send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
