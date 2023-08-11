import { Request, Response } from "express";
import { ok, serverError } from "./handlers/handlers";
import { IProductLineItem } from "../services/interfaces/interfaces";
import { StripeService } from "../services/stripe-service";

export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  makeCheckout = async (req: Request, res: Response) => {
    try {
      const { line_items: lineItems } = req.body as any;

      const result = await this.stripeService.makeCheckout(
        lineItems as IProductLineItem[]
      );

      return ok(res, result.url);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
