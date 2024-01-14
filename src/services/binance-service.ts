import {
  BINANACE_PAY_BASE_URL,
  BINANCE_API_KEY,
  BINANCE_CANCEL_URL,
  BINANCE_GET_TIME_URL,
  BINANCE_SECRET_KEY,
  BINANCE_SUCESS_URL
} from "../common/environment-consts";
import { HttpClient } from "../config/client";
import { OrderRepository } from "../repositories/order-repository";
import {
  IDeliveryInformation,
  ILineItem,
  ILineItemsService,
  IPaymentService,
  IProductLineItem
} from "./interfaces/interfaces";
import * as crypto from "crypto";
import { TelegramService } from "./telegram-service";

export class BinanceService implements IPaymentService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly orderRepository: OrderRepository,
    private readonly telegramService: TelegramService,
    private readonly lineItemsService: ILineItemsService
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

    lineItemsToBeSend = await this.lineItemsService.getLineItemsToBeSend(
      products,
      lineItems
    );

    const body = this.makeRequestBody(
      this.lineItemsService.calculateAmmount(lineItemsToBeSend),
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

  async switchOrderStatus(ip: string, status: string): Promise<void> {
    return await this.lineItemsService.switchOrderStatus(ip, status);
  }
}
