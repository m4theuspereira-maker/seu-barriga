import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT || 3000;
export const STRIPE_SDK_KEY = process.env.STRIPE_SDK_KEY;
export const SUCCESS_URL = process.env.SUCCESS_URL;
export const CANCEL_URL = process.env.CANCEL_URL;
