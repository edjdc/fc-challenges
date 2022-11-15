import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const productFacade = ProductAdmFacadeFactory.create();
  try {
    const input = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };
    const output = await productFacade.addProduct(input);
    res.status(201).send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
