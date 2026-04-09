/**
 * Prisma Client Singleton
 * 
 * Prevents multiple Prisma Client instances during development (hot reloading)
 * and provides a single instance throughout the application.
 * 
 * Uses lazy initialization to avoid connection issues during build on Vercel.
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

const prismaClientOptions = {
  log: ['error', 'warn'] as ('error' | 'warn')[],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaClientOptions)
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient(prismaClientOptions)
  }
  prisma = globalForPrisma.prisma
}

export default prisma