import Stripe from "stripe";
import {
  IDeliveryInformation,
  ILineItem,
  IPaymentService,
  IProductLineItem
} from "./interfaces/interfaces";
import { LineItemsRepository } from "../repositories/line-items-repository";
import {
  STRIPE_CANCEL_URL,
  STRIPE_SUCESS_URL,
  WOOCOMMERCE_COSTUMER_KEY,
  WOOCOMMERCE_COSTUMER_SECRET
} from "../common/environment-consts";
import { OrderRepository } from "../repositories/order-repository";
import { HttpClient } from "../config/client";
import { TelegramService } from "./telegram-service";

export class StripeService implements IPaymentService {
  constructor(
    private readonly stripeConfig: Stripe,
    private readonly lineItemsRepository: LineItemsRepository,
    private readonly orderRepository: OrderRepository,
    private readonly httpClient: HttpClient,
    private readonly telegramService: TelegramService
  ) {}

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
  }

  async makeCheckout(
    lineItems: Array<IProductLineItem>,
    ip: string,
    externalOrderId: string,
    deliveryInformation?: IDeliveryInformation
  ) {
    let lineItemsToBeSend: ILineItem[] = [];
    const products = lineItems.map((lineItem) => lineItem.name);
    const deliveruInformationWithProdutcts = {
      ...deliveryInformation,
      products
    };

    if (ip) {
      await this.orderRepository.create({ ip, externalOrderId });
    }

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
          quantity: Number(lineItem.quantity)
        });
      }
    });

    return this.intergrateWithStripe(
      lineItemsToBeSend,
      deliveruInformationWithProdutcts as any
    );
  }

  private async intergrateWithStripe(
    lineItems: Array<ILineItem>,
    deliveryInformation?: IDeliveryInformation
  ) {
    const { url } = await this.stripeConfig.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: STRIPE_SUCESS_URL!,
      cancel_url: STRIPE_CANCEL_URL!,
      allow_promotion_codes: true
    });

    if (deliveryInformation?.firstName != undefined) {
      await this.telegramService.sendMessageToTelegramBot(
        this.telegramService.formatMessage(deliveryInformation)
      );
    }

    return { url: url };
  }
}
