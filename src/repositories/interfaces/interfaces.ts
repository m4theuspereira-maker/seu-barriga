export interface IRepository {
  create(input: any): Promise<any>;

  createMany(input: any): Promise<any>;

  update(id: string, updatePlayload: any): Promise<any>;

  findMany(input?: any): Promise<any>;

  findOne(input: any): Promise<any>;
}

