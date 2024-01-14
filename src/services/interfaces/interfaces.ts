export interface ILineItem {
  price: string;
  quantity: number;
  ammount?: number;
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
    externalIdOrderId: string,
    deliveryInformation?: IDeliveryInformation
  ): Promise<{ url: string | null }>;

  switchOrderStatus(ip: string, status: string): Promise<void>;
}

export interface IDeliveryInformation {
  firstName: string;
  lastName: string;
  country: string;
  streetHouseNumber?: string;
  city: string;
  houseType?: string;
  state: string;
  zipCode: string;
  phone: string;
  emailAddress: string;
  additionalInformation?: string;
  products?: string[];
}

export interface IBinanceReponseBody {
  status: string;
  code: string;
  data: {
    currency: string;
    totalFee: string;
    fiatCurrency: string;
    fiatAmount: string;
    prepayId: string;
    terminalType: string;
    expireTime: number;
    qrcodeLink: string;
    qrContent: string;
    checkoutUrl: string;
    deeplink: string;
    universalUrl: string;
  };
}

export interface IBinanceOrderHeader {
  "content-type": "application/json";
  "BinancePay-Timestamp": number; // UnixTimestamp em milissegundos
  "BinancePay-Nonce": String; // Substitua com o valor aleatório desejado
  "BinancePay-Certificate-SN": string; // Substitua com a chave certificado
  "BinancePay-Signature": string;
}

export interface ILineItemsService {
  getLineItemsToBeSend(
    products: string[],
    lineItems: IProductLineItem[]
  ): Promise<ILineItem[]>;

  switchOrderStatus(ip: string, status: string): Promise<any>;

  calculateAmmount(lineItems: ILineItem[]): number;
}
