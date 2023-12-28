import {
  BINANCE_API_KEY,
  BINANCE_SECRET_KEY
} from "../common/environment-consts";
import { HttpClient } from "../config/client";
import { IDeliveryInformation, IPaymentService } from "./interfaces/interfaces";
import * as crypto from "crypto";

export class BinanceService implements IPaymentService {
  constructor(private readonly httpClient: HttpClient) {}

  async authenticateBinanceAccount() {
    const endpoint = "https://bpay.binanceapi.com";

    const body = {
      env: {
        terminalType: "WEB"
      },
      orderTags: {
        ifProfitSharing: false
      },
      merchantTradeNo: new Date().getTime().toString(),
      fiatAmount: 200,
      fiatCurrency: "USD",
      returnUrl: "",
      cancelUrl: "",
      goods: {
        goodsType: "01",
        goodsCategory: "Z000",
        referenceGoodsId: "p0ZoB1FwH6",
        goodsName: "MIHOROBA - 0.5kg powder",
        goodsDetail: "MIHOROBA"
      }
    };

    const {
      data: { serverTime }
    } = await this.httpClient.get("https://api4.binance.com/api/v3/time");

    const nonce = this.generateNonce(32);

    const payload = `${serverTime}\n${nonce}\n${JSON.stringify(body)}\n`;

    const signature = this.generateSignature(payload);

    const headers = this.makeHeader(serverTime, nonce, signature) as any;

    const { data } = await this.httpClient.post(
      `${endpoint}/binancepay/openapi/v2/order`,
      body,
      { headers }
    );

    return data;
  }

  makeCheckout(
    lineItems: any[],
    ip: string,
    externalIdOrderId: string,
    deliveryInformation?: IDeliveryInformation | undefined
  ): Promise<{ url: string | null }> {
    throw new Error("Method not implemented.");
  }
  switchOrderStatus(ip: string, status: string): Promise<void> {
    throw new Error("Method not implemented.");
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
    const signature = hmac.digest("hex").toUpperCase();
    return signature;
  }
}
