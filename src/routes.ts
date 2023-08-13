import { Router } from "express";
import { paymentFactory } from "./factories/factories";

const paymentControllerFactory = paymentFactory();
const routes = Router();
routes.get("/", (req, res) => res.send("I'm working"));
routes.post("/checkout-payment", paymentControllerFactory.makeCheckout);
routes.put("/order-id", paymentControllerFactory.switchOrderStatus);

export { routes };
