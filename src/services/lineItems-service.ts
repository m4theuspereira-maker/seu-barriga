import {
  WOOCOMMERCE_COSTUMER_KEY,
  WOOCOMMERCE_COSTUMER_SECRET
} from "../common/environment-consts";
import { HttpClient } from "../config/client";
import { LineItemsRepository } from "../repositories/line-items-repository";
import { OrderRepository } from "../repositories/order-repository";
import {
  ILineItem,
  ILineItemsService,
  IProductLineItem
} from "./interfaces/interfaces";

export class LineItemsService implements ILineItemsService {
  constructor(
    private readonly lineItemsRepository: LineItemsRepository,
    private readonly orderRepository: OrderRepository,
    private readonly httpClient: HttpClient
  ) {}

  async switchOrderStatus(ip: string, status: string): Promise<any> {
    const orderFound = (await this.orderRepository.findMany(ip)).at(0);
    const url = `https://mimosapowders.com/wp-json/wc/v3/orders/${
      orderFound?.externalOrderId
    }?consumer_key=${WOOCOMMERCE_COSTUMER_KEY!}&consumer_secret=${WOOCOMMERCE_COSTUMER_SECRET!}`;
    const result = await this.httpClient.put(
      url,
      { status },
      { headers: { "Content-Type": "application/json" } }
    );

    return result.data;
  }

  async getLineItemsToBeSend(
    products: string[],
    lineItems: IProductLineItem[]
  ) {
    let lineItemsToBeSend: ILineItem[] = [];
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
          quantity: Number(lineItem.quantity),
          ammount: priceFound?.ammount,
          guruPaymentLink: priceFound.guruPaymentLink!
        });
      }
    });

    return lineItemsToBeSend;
  }

  calculateAmmount(lineItems: ILineItem[]) {
    return lineItems.reduce((accumulator, currentValue: ILineItem) => {
      const product = currentValue.ammount! * currentValue.quantity;
      return accumulator + product;
    }, 0);
  }
}
