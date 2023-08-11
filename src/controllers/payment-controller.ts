import { ILineItem, StripeService } from "../services/stripe-service";
import { Request, Response } from "express";
import { ok, serverError } from "./handlers/handlers";

export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  makeCheckout = async (req: Request, res: Response) => {
    try {
      const { line_items: lineItems } = req.body as any;

      const result = await this.stripeService.makeCheckout(
        lineItems as ILineItem[]
      );

      // return res.redirect(result.url!);
      return ok(res, result.url);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
