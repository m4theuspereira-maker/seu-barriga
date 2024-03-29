import { describe, expect, it } from "vitest";
import axios from "axios";
import { LineItemsRepository } from "../../src/repositories/line-items-repository";
import { client } from "../../src/config/client";
import { OrderRepository } from "../../src/repositories/order-repository";
import { LineItemsService } from "../../src/services/lineItems-service";

describe("BinanceService", () => {
  describe("calculateAmmount", () => {
    it("should return an ammount for products", () => {
      const lineLitems = [
        { price: "", quantity: 1, ammount: 10 },
        { price: "", quantity: 2, ammount: 15 },
        { price: "", quantity: 1, ammount: 7 },
        { price: "", quantity: 3, ammount: 8 }
      ];

      const result = new LineItemsService(
        new LineItemsRepository(client),
        new OrderRepository(client),
        axios
      )["calculateAmmount"](lineLitems);

      expect(result).toBe(71);
    });
  });
});
