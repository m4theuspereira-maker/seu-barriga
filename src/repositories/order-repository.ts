import { PrismaClient } from "@prisma/client";
import { IOrder, IOrderFound, IRepository } from "./interfaces/interfaces";
import { ObjectId } from "mongodb";

export class OrderRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  create(order: IOrder): Promise<any> {
    return this.client.order.create({
      data: { id: new ObjectId().toString(), ...order }
    });
  }

  createMany(input: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(id: string, updatePlayload: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async findMany(ip: string): Promise<IOrderFound[]> {
    return this.client.order.findMany({
      where: { ip },
      orderBy: { createdAt: "desc" }
    });
  }
  async findOne(ip: string): Promise<IOrderFound | null> {
    return this.client.order.findFirst({ where: { ip } });
  }
}
