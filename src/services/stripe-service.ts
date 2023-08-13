import Stripe from "stripe";
import {
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

export class StripeService implements IPaymentService {
  constructor(
    private readonly stripeConfig: Stripe,
    private readonly lineItemsRepository: LineItemsRepository,
    private readonly orderRepository: OrderRepository,
    private readonly httpClient: HttpClient
  ) {}

  async switchOrderStatus(ip: string, status: string): Promise<string> {
    const orderFound = (await this.orderRepository.findMany(ip)).at(0);

    console.log(orderFound?.externalOrderId);

    const url = `https://mimosapowders.com/wp-json/wc/v3/orders/${
      orderFound?.externalOrderId
    }?consumer_key=${WOOCOMMERCE_COSTUMER_KEY!}&consumer_secret=${WOOCOMMERCE_COSTUMER_SECRET!}`;
    const result = await this.httpClient.put(
      url,
      { status },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(result.statusText);

    return result.statusText;
  }

  async makeCheckout(
    lineItems: Array<IProductLineItem>,
    ip: string,
    externalOrderId: string
  ) {
    let lineItemsToBeSend: ILineItem[] = [];

    await this.orderRepository.create({ ip, externalOrderId });

    const productsFound = await this.lineItemsRepository.findMany(
      lineItems.map((lineItem) => lineItem.name)
    );

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

    return this.intergrateWithStripe(lineItemsToBeSend);
  }

  private async intergrateWithStripe(lineItems: Array<ILineItem>) {
    const { url } = await this.stripeConfig.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: STRIPE_SUCESS_URL!,
      cancel_url: STRIPE_CANCEL_URL!
    });
    return { url };
  }
}
