import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import argon2 from 'argon2'
import { USERS } from './constants'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function seedUsers() {
  console.log('🌾 Creating users...')

  for (const user of USERS) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: await argon2.hash(user.password),
      },
    })
    console.log(`  ✔ ${created.email}`)
  }
}

async function up() {
  console.log('🌱 Starting seed process...\n')

  await seedUsers()

  console.log('\n✅ Seed completed successfully!')
}

async function down() {
  console.log('🧹 Cleaning database...\n')

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "User"
    RESTART IDENTITY CASCADE
  `)

  console.log('✅ Database cleaned!')
}

async function main() {
  const args = process.argv.slice(2)

  try {
    if (args.includes('--down') || args.includes('-d')) {
      await down()
    } else if (args.includes('--seed-only') || args.includes('-s')) {
      await up()
    } else {
      await down()
      await up()
    }
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
