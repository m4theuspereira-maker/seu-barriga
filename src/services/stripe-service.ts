import Stripe from "stripe";
import {
  ILineItem,
  IPaymentService,
  IProductLineItem
} from "./interfaces/interfaces";
import { LineItemsRepository } from "../repositories/line-items-repository";
import {
  STRIPE_CANCEL_URL,
  STRIPE_SUCESS_URL
} from "../common/environment-consts";

export class StripeService implements IPaymentService {
  constructor(
    private readonly stripeConfig: Stripe,
    private readonly lineItemsRepository: LineItemsRepository
  ) {}

  async makeCheckout(lineItems: Array<IProductLineItem>) {
    let lineItemsToBeSend: ILineItem[] = [];

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
