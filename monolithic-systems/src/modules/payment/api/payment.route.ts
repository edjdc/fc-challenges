import express, { Request, Response } from "express";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

export const paymentRoute = express.Router();

paymentRoute.post("/", async (req: Request, res: Response) => {
  const paymentFacade = PaymentFacadeFactory.create();
  try {
    const input = {
      orderId: req.body.orderId,
      amount: Number(req.body.amount),
    };
    const output = await paymentFacade.process(input);
    res.status(200).send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
