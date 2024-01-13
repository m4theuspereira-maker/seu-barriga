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

export function binanceControlleFactory(binanceFactory: BinanceService) {
  return new PaymentController(binanceFactory);
}
