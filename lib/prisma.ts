import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// Ini yang dipanggil! Path ini mengarah ke client yang sudah di-generate
import { PrismaClient } from '../app/generated/prisma'; 

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const setupPrisma = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter, log: ['query'] });
};

// Mengekspor variabel 'prisma' untuk dipakai di file route.ts API kita
export const prisma = globalForPrisma.prisma || setupPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;