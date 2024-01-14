import {
  PAYZEN_API_PASSWORD,
  PAYZEN_API_USERNAME,
  PAYZEN_BASE_URL
} from "../common/environment-consts";
import { HttpClient } from "../config/client";
import { OrderRepository } from "../repositories/order-repository";
import {
  IDeliveryInformation,
  ILineItem,
  ILineItemsService,
  IPaymentService
} from "./interfaces/interfaces";
import { TelegramService } from "./telegram-service";

export class PayzenService implements IPaymentService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly lineItemsService: ILineItemsService,
    private readonly httpClient: HttpClient,
    private readonly telegramService: TelegramService
  ) {}

  async makeCheckout(
    lineItems: any[],
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

    const token = Buffer.from(
      `${PAYZEN_API_USERNAME}:${PAYZEN_API_PASSWORD}`
    ).toString("base64");

    const amount = this.lineItemsService.calculateAmmount(lineItemsToBeSend);

    const {
      data: {
        USDBRL: { high }
      }
    } = await this.httpClient.get(
      "https://economia.awesomeapi.com.br/last/USD-BRL"
    );

    const amountToBePaid = amount * high;

    let additionalInformations = {};
    const body = {
      amount: Math.round(amountToBePaid * 100),
      currency: "BRL",
      locale: "en_EN",
      orderId: new Date().getTime().toString()
    } as any;

    if (deliveryInformation?.firstName != undefined) {
      await this.telegramService.sendMessageToTelegramBot(
        this.telegramService.formatMessage({ ...deliveryInformation, products })
      );

      additionalInformations = {
        firstName: deliveryInformation?.firstName,
        lastName: deliveryInformation?.lastName,
        phoneNumber: deliveryInformation?.phone,
        streetNumber: deliveryInformation?.streetHouseNumber,
        address: deliveryInformation?.additionalInformation,
        zipCode: deliveryInformation?.zipCode,
        city: deliveryInformation?.zipCode,
        state: deliveryInformation?.state,
        country: deliveryInformation?.country
      };

      body.customer = {
        email: deliveryInformation?.emailAddress,
        billingDetails: {
          category: "PRIVATE",
          ...additionalInformations
        }
      };
    }

    const { data } = await this.httpClient.post(
      `${PAYZEN_BASE_URL}/api-payment/V4/Charge/CreatePaymentOrder`,
      body,
      {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json"
        }
      } as any
    );

    return { url: data.answer.paymentURL };
  }

  async switchOrderStatus(ip: string, status: string): Promise<void> {
    return await this.lineItemsService.switchOrderStatus(ip, status);
  }
}
