import { PrismaClient } from '../app/generated/prisma'; 

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Inisialisasi PrismaClient standar tanpa adaptor tambahan
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}