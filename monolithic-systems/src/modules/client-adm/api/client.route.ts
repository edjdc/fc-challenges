import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const clientAdmFacade = ClientAdmFacadeFactory.create();
  try {
    const input = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
    };
    const output = await clientAdmFacade.add(input);
    res.status(201).send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
