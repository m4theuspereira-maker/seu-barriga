import { beforeAll, describe, expect, it } from "vitest";
import { StripeService } from "../../src/services/stripe-service";
import { stripeConfig } from "../../src/config/stripe-config";
import { LineItemsRepository } from "../../src/repositories/line-items-repository";
import { OrderRepository } from "../../src/repositories/order-repository";
import axios from "axios";
import { telegramService } from "../../src/factories/factories";
import { client } from "../../src/config/client";

describe("StripeService", () => {
  let stripeService: StripeService;

  beforeAll(() => {
    stripeService = new StripeService(
      stripeConfig,
      new LineItemsRepository(client),
      new OrderRepository(client),
      axios,
      telegramService
    );
  });

  describe("formatMessage", () => {
    it("should return products array as string", () => {
      const result = telegramService.formatMessage({
        firstName: "Matheus",
        lastName: "Santos Pereira",
        country: "Brasil",
        city: "Tobias Barreto",
        streetHouseNumber: "Rua Carlos Lemos, 638",
        houseType: "",
        state: "- Select Concelho -",
        zipCode: "943000000",
        phone: "9999999999999999",
        emailAddress: "matheusmonaco1@hotmail.com",
        additionalInformation: "",
        products: ["Mimosa H. Inner Root Bark (MHRB) – Powder - 0,5kg"]
      });

      expect(result).toMatchSnapshot(
        `🛍️ **Nova Compra Realizada** 🛍️

      ℹ️ **Detalhes da Compra:**
      🗣️ Para: Matheus Santos Pereira,
      📦 Produtos: Mimosa H. Inner Root Bark (MHRB) – Powder - 0,5kg
      🌎 País: Brasil
      🏡 Estado: - Select Concelho -
      🏙️ Cidade: Tobias Barreto
      📬 ZipCode: 943000000
      📞 Telefone: 9999999999999999
      📧 E-mail: matheusmonaco1@hotmail.com
      🛣️ Rua e número: Rua Carlos Lemos, 638
      🏘️ Tipo de residência:
      🗞️ Informações Adicionais: `
      );
    });
  });
});
