import {
  BINANACE_PAY_BASE_URL,
  BINANCE_API_KEY,
  BINANCE_CANCEL_URL,
  BINANCE_GET_TIME_URL,
  BINANCE_SECRET_KEY,
  BINANCE_SUCESS_URL,
  WOOCOMMERCE_COSTUMER_KEY,
  WOOCOMMERCE_COSTUMER_SECRET
} from "../common/environment-consts";
import { HttpClient } from "../config/client";
import { LineItemsRepository } from "../repositories/line-items-repository";
import { OrderRepository } from "../repositories/order-repository";
import {
  IDeliveryInformation,
  ILineItem,
  IPaymentService,
  IProductLineItem
} from "./interfaces/interfaces";
import * as crypto from "crypto";
import { TelegramService } from "./telegram-service";

export class BinanceService implements IPaymentService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly lineItemsRepository: LineItemsRepository,
    private readonly orderRepository: OrderRepository,
    private readonly telegramService: TelegramService
  ) {}

  async makeCheckout(
    lineItems: IProductLineItem[],
    ip: string,
    externalOrderId: string,
    deliveryInformation?: IDeliveryInformation | undefined
  ): Promise<{ url: string | null }> {
    let lineItemsToBeSend: ILineItem[] = [];
    const products = lineItems.map((lineItem) => lineItem.name);

    if (ip) {
      await this.orderRepository.create({ ip, externalOrderId });
    }

    lineItemsToBeSend = await this.getLineItemsToBeSend(products, lineItems);

    const body = this.makeRequestBody(
      this.calculateAmmount(lineItemsToBeSend),
      "MIROHOBA"
    );

    const {
      data: { serverTime }
    } = await this.httpClient.get(BINANCE_GET_TIME_URL);

    const nonce = this.generateNonce(32);

    const signature = this.generateSignature(
      `${serverTime}\n${nonce}\n${JSON.stringify(body)}\n`
    );

    const { data } = await this.httpClient.post(
      `${BINANACE_PAY_BASE_URL}/binancepay/openapi/v2/order`,
      body,
      { headers: this.makeHeader(serverTime, nonce, signature) as any }
    );

    if (deliveryInformation?.firstName != undefined) {
      await this.telegramService.sendMessageToTelegramBot(
        this.telegramService.formatMessage(deliveryInformation)
      );
    }

    return { url: data.data.universalUrl };
  }

  private generateNonce(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private makeHeader(serverTime: number, nonce: String, signature: string) {
    return {
      "content-type": "application/json",
      "BinancePay-Timestamp": serverTime, // UnixTimestamp em milissegundos
      "BinancePay-Nonce": nonce, // Substitua com o valor aleatório desejado
      "BinancePay-Certificate-SN": BINANCE_API_KEY, // Substitua com a chave certificado
      "BinancePay-Signature": signature
    };
  }

  private generateSignature(payload: string) {
    const hmac = crypto.createHmac("sha512", BINANCE_SECRET_KEY!);
    hmac.update(payload);
    return hmac.digest("hex").toUpperCase();
  }

  private makeRequestBody(ammount: number, productName: string) {
    return {
      env: {
        terminalType: "WEB"
      },
      orderTags: {
        ifProfitSharing: false
      },
      merchantTradeNo: new Date().getTime().toString(),
      fiatAmount: ammount,
      fiatCurrency: "USD",
      returnUrl: BINANCE_SUCESS_URL,
      cancelUrl: BINANCE_CANCEL_URL,
      goods: {
        goodsType: "01",
        goodsCategory: "Z000",
        referenceGoodsId: "p0ZoB1FwH6",
        goodsName: productName,
        goodsDetail: "MIHOROBA"
      }
    };
  }

  private calculateAmmount(lineItems: ILineItem[]) {
    return lineItems.reduce((accumulator, currentValue: ILineItem) => {
      const product = currentValue.ammount! * currentValue.quantity;
      return accumulator + product;
    }, 0);
  }

  async switchOrderStatus(ip: string, status: string): Promise<void> {
    const orderFound = (await this.orderRepository.findMany(ip)).at(0);
    const url = `https://mimosapowders.com/wp-json/wc/v3/orders/${
      orderFound?.externalOrderId
    }?consumer_key=${WOOCOMMERCE_COSTUMER_KEY!}&consumer_secret=${WOOCOMMERCE_COSTUMER_SECRET!}`;
    const result = await this.httpClient.put(
      url,
      { status },
      { headers: { "Content-Type": "application/json" } }
    );

    return result.data;
  }

  private async getLineItemsToBeSend(
    products: string[],
    lineItems: IProductLineItem[]
  ) {
    let lineItemsToBeSend: ILineItem[] = [];
    const productsFound = await this.lineItemsRepository.findMany(products);

    lineItems.forEach((lineItem) => {
      const priceFound = productsFound.find(
        (priceId) =>
          priceId.name.toLowerCase().trim() ===
          lineItem.name.toLowerCase().trim()
      );

      if (priceFound?.name) {
        lineItemsToBeSend.push({
          price: priceFound?.price!,
          quantity: Number(lineItem.quantity),
          ammount: priceFound?.ammount
        });
      }
    });

    return lineItemsToBeSend;
  }
}
