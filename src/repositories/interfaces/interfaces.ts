export interface IRepository {
  create(input: any): Promise<any>;

  createMany(input: any): Promise<any>;

  update(id: string, updatePlayload: any): Promise<any>;

  findMany(input?: any): Promise<any>;

  findOne(input: any): Promise<any>;
}

export interface IOrder {
  externalOrderId: string;
  ip: string;
}

export interface IOrderFound extends IOrder {
  id: string;
  createdAt: Date;
}
