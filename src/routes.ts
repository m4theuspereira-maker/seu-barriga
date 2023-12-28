import { Router } from "express";
import { paymentFactory } from "./factories/factories";
import { ValidationMiddlewares } from "./middlewares/validation-middlewares";

const paymentControllerFactory = paymentFactory();
const routes = Router();
routes.get("/", (req, res) => res.send("I'm working"));
routes.post(
  "/checkout-payment",
  ValidationMiddlewares.checkoutPayment,
  paymentControllerFactory.makeCheckout
);
routes.put("/order-id", paymentControllerFactory.switchOrderStatus);

routes.post(
  "/checkout-payment/binance",
  paymentControllerFactory.generateBinanceLink
);

export { routes };
