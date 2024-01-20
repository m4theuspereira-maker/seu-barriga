import axios from "axios";
import { client } from "../config/client";
import { stripeConfig } from "../config/stripe-config";
import { PaymentController } from "../controllers/payment-controller";
import { LineItemsRepository } from "../repositories/line-items-repository";
import { StripeService } from "../services/stripe-service";
import { OrderRepository } from "../repositories/order-repository";
import { TelegramService } from "../services/telegram-service";
import { BinanceService } from "../services/binance-service";
import { LineItemsService } from "../services/lineItems-service";
import { PayzenService } from "../services/payzen-service";
import { GuruService } from "../services/guru-service";

export const telegramService = new TelegramService(axios);

export function paymentFactory() {
  return new PaymentController(
    new StripeService(
      stripeConfig,
      new LineItemsRepository(client),
      new OrderRepository(client),
      axios,
      telegramService
    )
  );
}

export function binanceFactory() {
  return new BinanceService(
    axios,
    new OrderRepository(client),
    telegramService,
    new LineItemsService(
      new LineItemsRepository(client),
      new OrderRepository(client),
      axios
    )
  );
}

export function payzenFactory() {
  return new PayzenService(
    new OrderRepository(client),
    new LineItemsService(
      new LineItemsRepository(client),
      new OrderRepository(client),
      axios
    ),
    axios,
    new TelegramService(axios)
  );
}

export function guruFactory() {
  return new GuruService(
    new OrderRepository(client),
    new LineItemsService(
      new LineItemsRepository(client),
      new OrderRepository(client),
      axios
    ),
    new TelegramService(axios)
  );
}

export function binanceControlleFactory(binanceFactory: BinanceService) {
  return new PaymentController(binanceFactory);
}

export function payzenControllerFactory(payzenFactory: PayzenService) {
  return new PaymentController(payzenFactory);
}

export function guruControllerFactory(guruFactory: GuruService) {
  return new PaymentController(guruFactory);
}
