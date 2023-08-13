import { PrismaClient } from "@prisma/client";
import { Axios } from "axios";

export const client = new PrismaClient();

export declare type HttpClient = Axios
