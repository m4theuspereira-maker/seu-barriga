import { Request, Response } from "express";
import { ok, serverError } from "./handlers/handlers";
import {
  IPaymentService,
  IProductLineItem
} from "../services/interfaces/interfaces";

export class PaymentController {
  constructor(private readonly paymentService: IPaymentService) {}

  makeCheckout = async (req: Request, res: Response) => {
    try {
      const { meuIP: ip, dados, deliveryInformation } = req.body as any;


      const { id: externalOrderId, line_items: lineItems } = dados;

      const result = await this.paymentService.makeCheckout(
        lineItems as IProductLineItem[],
        ip,
        externalOrderId,
        deliveryInformation
      );

      return ok(res, result.url!);
    } catch (error) {
      return serverError(res, error);
    }
  };

  switchOrderStatus = async (req: Request, res: Response) => {
    try {
      const { meuIP, status } = req.body as any;

      await this.paymentService.switchOrderStatus(meuIP, status);

      return ok(res, `ok`);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
