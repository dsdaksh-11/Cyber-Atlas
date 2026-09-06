import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

function resolveDatabaseUrl(): string {
  // If explicitly configured with an external database (e.g. Postgres / Turso / Supabase)
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith('file:')
  ) {
    return process.env.DATABASE_URL
  }

  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL_ENV
  )

  const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db')

  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'dev.db')
    if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
      if (fs.existsSync(/*turbopackIgnore: true*/ bundledDbPath)) {
        try {
          fs.copyFileSync(bundledDbPath, tmpDbPath)
          console.log('[Prisma] Copied database to writable /tmp/dev.db')
        } catch (err) {
          console.error('[Prisma] Error copying database to /tmp:', err)
        }
      }
    }

    if (fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
      return `file:${tmpDbPath}`
    }
  }

  if (fs.existsSync(/*turbopackIgnore: true*/ bundledDbPath)) {
    return `file:${bundledDbPath.replace(/\\/g, '/')}`
  }

  return 'file:./dev.db'
}

process.env.DATABASE_URL = resolveDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
