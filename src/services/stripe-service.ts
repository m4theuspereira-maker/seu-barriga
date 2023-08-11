import Stripe from "stripe";
import {
  STRIPE_CANCEL_URL as cancel_url,
  priceIds,
  SUCCESS_URL
} from "../common/environment-consts";

export interface ILineItem {
  price: string;
  quantity: number;
}

export class StripeService {
  constructor(private readonly stripeConfig: Stripe) {}

  async makeCheckout(lineItems: Array<any>) {
    let lineItemsToBeSend: ILineItem[] = [];

    lineItems.forEach((lineItem) => {
      const priceFound = priceIds.find(
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
      success_url: "https://mimosapowders.com/",
      cancel_url: "https://mimosapowders.com/"
    });
    return { url };
  }
}
