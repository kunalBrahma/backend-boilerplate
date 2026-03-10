import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  // Prisma 7: PrismaPg takes connectionString directly
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });
}

const prisma = globalThis.__prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export default prisma;