export interface IRepository {
  create(input: any): Promise<any>;

  findMany(input?: any): Promise<any>;
}

export interface IOrder {
  externalOrderId: string;
  ip: string;
}

export interface IOrderFound extends IOrder {
  id: string;
  createdAt: Date;
}
