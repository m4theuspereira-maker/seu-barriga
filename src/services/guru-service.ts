import { HttpClient } from "../config/client";
import { OrderRepository } from "../repositories/order-repository";
import {
  IDeliveryInformation,
  ILineItem,
  ILineItemsService,
  IPaymentService
} from "./interfaces/interfaces";
import { TelegramService } from "./telegram-service";

export class GuruService implements IPaymentService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly lineItemsService: ILineItemsService,
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

    if (deliveryInformation?.firstName != undefined) {
      await this.telegramService.sendMessageToTelegramBot(
        this.telegramService.formatMessage({ ...deliveryInformation, products })
      );
    }

    return { url: lineItemsToBeSend.at(0)?.guruPaymentLink! };
  }

  async switchOrderStatus(ip: string, status: string): Promise<void> {
    return await this.lineItemsService.switchOrderStatus(ip, status);
  }
}
