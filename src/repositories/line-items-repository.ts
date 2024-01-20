import { PrismaClient } from "@prisma/client";
import { IRepository } from "./interfaces/interfaces";
import { ObjectId } from "mongodb";

export class LineItemsRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(item: { name: string; price: string; ammount: number }) {
    return this.client.lineItem.create({
      data: { ...item, id: new ObjectId().toString() }
    });
  }

  async createMany(
    lineItems: { price: string; name: string; ammount: number }[]
  ) {
    const data = lineItems.map((lineItem) => ({
      ammount: lineItem.ammount,
      price: lineItem.price,
      name: lineItem.name,
      id: new ObjectId().toString()
    }));

    return this.client.lineItem.createMany({ data });
  }
  update(id: string, updatePlayload: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async findMany(names: string[]): Promise<
    {
      price: string;
      name: string;
      ammount?: number;
      guruPaymentLink?: string | null;
    }[]
  > {
    return this.client.lineItem.findMany({ where: { name: { in: names } } });
  }

  findOne(input: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
