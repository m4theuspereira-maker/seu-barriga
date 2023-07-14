import Stripe from "stripe";
import { STRIPE_SDK_KEY } from "../common/environment-consts";

export const stripeConfig = new Stripe(STRIPE_SDK_KEY!, {
  apiVersion: "2022-11-15"
});
