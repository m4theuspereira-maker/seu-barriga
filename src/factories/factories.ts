import { stripeConfig } from "../config/stripe-config";
import { PaymentController } from "../controllers/payment-controller";
import { StripeService } from "../services/stripe-service";

export function paymentFactory() {
  return new PaymentController(new StripeService(stripeConfig));
}
