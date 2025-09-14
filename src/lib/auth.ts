import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key',
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
})
