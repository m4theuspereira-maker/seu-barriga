import axios from "axios";
import { client } from "../config/client";
import { stripeConfig } from "../config/stripe-config";
import { PaymentController } from "../controllers/payment-controller";
import { LineItemsRepository } from "../repositories/line-items-repository";
import { StripeService } from "../services/stripe-service";
import { OrderRepository } from "../repositories/order-repository";

export function paymentFactory() {
  return new PaymentController(
    new StripeService(
      stripeConfig,
      new LineItemsRepository(client),
      new OrderRepository(client),
      axios
    )
  );
}
