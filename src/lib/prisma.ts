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

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  prisma = globalForPrisma.prisma
}

export default prisma