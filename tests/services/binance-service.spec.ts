import { beforeAll, describe, expect, it } from "vitest";
import { BinanceService } from "../../src/services/binance-service";
import axios from "axios";
import { LineItemsRepository } from "../../src/repositories/line-items-repository";
import { client } from "../../src/config/client";
import { OrderRepository } from "../../src/repositories/order-repository";
import { TelegramService } from "../../src/services/telegram-service";

describe("BinanceService", () => {
  let binanceService: BinanceService;

  beforeAll(() => {
    binanceService = new BinanceService(
      axios,
      new LineItemsRepository(client),
      new OrderRepository(client),
      new TelegramService(axios)
    );
  });

  describe("calculateAmmount", () => {
    it("should return an ammount for products", () => {
      const lineLitems = [
        { price: "", quantity: 1, ammount: 10 },
        { price: "", quantity: 2, ammount: 15 },
        { price: "", quantity: 1, ammount: 7 },
        { price: "", quantity: 3, ammount: 8 }
      ];

      const result = binanceService["calculateAmmount"](lineLitems);

      expect(result).toBe(71);
    });
  });
});
