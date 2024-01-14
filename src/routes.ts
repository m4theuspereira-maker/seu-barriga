import { Router } from "express";
import {
  binanceControlleFactory,
  binanceFactory,
  paymentFactory,
  payzenControllerFactory,
  payzenFactory
} from "./factories/factories";
import { ValidationMiddlewares } from "./middlewares/validation-middlewares";

const paymentControllerFactory = paymentFactory();
const binancePaymentFactory = binanceControlleFactory(binanceFactory());
const payzenPaymentFactory = payzenControllerFactory(payzenFactory());
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

routes.post(
  "/payzen/chechout-payment",
  ValidationMiddlewares.checkoutPayment,
  payzenPaymentFactory.makeCheckout
);

routes.put("/order-id", binancePaymentFactory.switchOrderStatus);

export { routes };
