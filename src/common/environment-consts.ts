import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT || 3000;
export const STRIPE_SDK_KEY = process.env.STRIPE_SDK_KEY;
export const SUCCESS_URL = process.env.SUCCESS_URL;
export const CANCEL_URL = process.env.CANCEL_URL;
export const STRIPE_SUCESS_URL = process.env.STRIPE_SUCESS_URL;
export const STRIPE_CANCEL_URL = process.env.STRIPE_CANCEL_URL;
export const WOOCOMMERCE_COSTUMER_KEY =
  "ck_3c017c2a68d3c1327ff77c5f16d3c0ac1bd2a874";
export const WOOCOMMERCE_COSTUMER_SECRET =
  "cs_4bdf64427bc7e74ebfb9f1b07be509f96a6b546";
export const priceIds = [
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Powder - 0,5kg",
    price: "price_1NTrgnESfitFYyaBNduSy0uP",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Powder - 1kg",
    price: "price_1NTrlLESfitFYyaBHfNTjh73",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Powder - 1.5kg",
    price: "price_1NTrmpESfitFYyaB0zqpT307",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Powder - 2kg",
    price: "price_1NTrohESfitFYyaBwpOU3oSl",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Powder - 3kg",
    price: "price_1NTrpwESfitFYyaBsLFq0QD6",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Powder - 5kg",
    price: "price_1NTrqsESfitFYyaBU25kMNd1",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Shredded - 0,5kg",
    price: "price_1NddkBESfitFYyaB8XFJTJAZ",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Shredded - 1kg",
    price: "price_1NddnyESfitFYyaBlNzGBos6",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Shredded - 1.5kg",
    price: "price_1Nddp6ESfitFYyaBayvzHH7l",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Shredded - 2kg",
    price: "price_1NddpoESfitFYyaB5GVO88qU",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Shredded - 3kg",
    price: "price_1NddqmESfitFYyaBylP2KwmH",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Shredded - 5kg",
    price: "price_1NddrfESfitFYyaB85rX1Crv",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Whole - 0,5kg",
    price: "price_1NdduGESfitFYyaB1Jr9NEzv",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Whole - 1kg",
    price: "price_1NddurESfitFYyaBozDXsLvw",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Whole - 1.5kg",
    price: "price_1NddvfESfitFYyaBC0Y54dSQ",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Whole - 2kg",
    price: "price_1NddwDESfitFYyaB8Fb8Ixqy",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Whole - 3kg",
    price: "price_1NddxNESfitFYyaBbHTpdREr",
  },
  {
    name: "Mimosa hostilis Inner Root Bark (MHRB) – Whole - 5kg",
    price: "price_1NddyBESfitFYyaBTXIx3xxb",
  },
];
