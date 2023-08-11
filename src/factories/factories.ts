import { client } from "../config/client";
import { stripeConfig } from "../config/stripe-config";
import { PaymentController } from "../controllers/payment-controller";
import { LineItemsRepository } from "../repositories/line-items-repository";
import { StripeService } from "../services/stripe-service";

export function paymentFactory() {
  return new PaymentController(
    new StripeService(stripeConfig, new LineItemsRepository(client))
  );
}
