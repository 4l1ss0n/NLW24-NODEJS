import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

export const db: PrismaClient = new PrismaClient();
export const rddb = new Redis();
