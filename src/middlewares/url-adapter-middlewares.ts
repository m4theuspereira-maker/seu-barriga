import { NextFunction, Request, Response, Router } from "express";
import {
  binanceControlleFactory,
  binanceFactory,
  guruControllerFactory,
  guruFactory,
  paymentFactory,
  payzenControllerFactory,
  payzenFactory
} from "../factories/factories";
import { ValidationMiddlewares } from "./validation-middlewares";

const paymentControllerFactory = paymentFactory();
const binancePaymentFactory = binanceControlleFactory(binanceFactory());
const payzenPaymentFactory = payzenControllerFactory(payzenFactory());
const guruPaymentFactory = guruControllerFactory(guruFactory());

export const postControllers = {
  "/checkout-payment": paymentControllerFactory.makeCheckout,
  "/binance/checkout-payment": binancePaymentFactory.makeCheckout,
  "/payzen/chechout-payment": payzenPaymentFactory.makeCheckout,
  "/guru/chechout-payment": guruPaymentFactory.makeCheckout
};
export const POST_URLS = [...Object.keys(postControllers)];

export const controllerAdapter = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const controller = {
    ...postControllers
  }[req.url]!;

  return controller(req, res);
};

export const initializePostRoutes = (urls: string[], route: Router) => {
  urls.forEach((url) =>
    route.post(url, ValidationMiddlewares.checkoutPayment, controllerAdapter)
  );
};
