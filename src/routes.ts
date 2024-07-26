import { Request, Router } from "express";
import { binanceControlleFactory, binanceFactory } from "./factories/factories";
import { ValidationMiddlewares } from "./middlewares/validation-middlewares";
import {
  controllerAdapter,
  initializePostRoutes,
  POST_URLS
} from "./middlewares/url-adapter-middlewares";

const binancePaymentFactory = binanceControlleFactory(binanceFactory());

const routes = Router();

initializePostRoutes(POST_URLS, routes);

routes.post(
  String((req: Request) => req.url),
  ValidationMiddlewares.checkoutPayment,
  controllerAdapter
);

routes.put("/order-id", binancePaymentFactory.switchOrderStatus);

export { routes };
