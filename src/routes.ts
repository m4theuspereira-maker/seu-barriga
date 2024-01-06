import { Router } from "express";
import {
  binanceControlleFactory,
  binanceFactory,
  paymentFactory
} from "./factories/factories";
import { ValidationMiddlewares } from "./middlewares/validation-middlewares";

const paymentControllerFactory = paymentFactory();
const binancePaymentFactory = binanceControlleFactory(binanceFactory());
const routes = Router();
routes.post(
  "/checkout-payment",
  ValidationMiddlewares.checkoutPayment,
  paymentControllerFactory.makeCheckout
);

routes.post(
  "/binance/checkout-payment",
  ValidationMiddlewares.checkoutPayment,
  binancePaymentFactory.makeCheckout
);
routes.put("/order-id", binancePaymentFactory.switchOrderStatus);

export { routes };
