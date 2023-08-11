import { Request, Response } from "express";
import { ok, serverError } from "./handlers/handlers";
import { IPaymentService, IProductLineItem } from "../services/interfaces/interfaces";

export class PaymentController {
  constructor(private readonly paymentService: IPaymentService) {}

  makeCheckout = async (req: Request, res: Response) => {
    try {
      const { line_items: lineItems } = req.body as any;

      const result = await this.paymentService.makeCheckout(
        lineItems as IProductLineItem[]
      );

      return ok(res, result.url);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
