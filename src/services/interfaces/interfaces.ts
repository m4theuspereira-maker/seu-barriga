export interface ILineItem {
  price: string;
  quantity: number;
}

export interface IProductLineItem {
  id: string;
  name: string;
  product_id: string;
  variation_id: string;
  quantity: string;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  meta_data: IProductMetadata[];
  sku: string;
  price: string;
  image: IProductImage;
  parent_name: string;
}

export interface IProductImage {
  id: string;
  src: string;
}

export interface IProductMetadata {
  id: string;
  key: string;
  value: string;
  display_key: string;
  display_value: string;
}

export interface IPaymentService {
  makeCheckout(
    lineItems: Array<any>,
    ip: string,
    externalIdOrderId: string
  ): Promise<{ url: string | null }>;

  switchOrderStatus(ip: string, status: string): Promise<void>;
}
