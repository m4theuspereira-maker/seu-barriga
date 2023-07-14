import Stripe from "stripe";

export interface ILineItem {
  price: string;
  quantity: number;
}

export class StripeService {
  constructor(private readonly stripeConfig: Stripe) {}

  async makeCheckout(lineItems: Array<ILineItem>) {
    const { url } = await this.stripeConfig.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "https://mimosapowders.com/",
      cancel_url: "https://mimosapowders.com/about-us/"
    });

    return { url };
  }
}
