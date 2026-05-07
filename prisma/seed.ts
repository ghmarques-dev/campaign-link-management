import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('senha123', 6)

  const user = await prisma.user.create({
    data: { name: 'Guilherme', email: 'guilherme@example.com', password },
  })

  const project = await prisma.project.create({
    data: { name: 'Campanha Black Friday', user_id: user.user_id },
  })

  await prisma.link.create({
    data: {
      name: 'Link Facebook',
      base_url: 'https://tracker.example.com',
      redirect_url: 'https://loja.com/black-friday',
      parameters: [
        { parameterId: crypto.randomUUID(), key: 'utm_source', value: 'facebook' },
        { parameterId: crypto.randomUUID(), key: 'utm_medium', value: 'cpc' },
      ],
      project_id: project.project_id,
    },
  })

  await prisma.link.create({
    data: {
      name: 'Link Google Ads',
      base_url: 'https://tracker.example.com',
      redirect_url: 'https://loja.com/black-friday',
      parameters: [
        { parameterId: crypto.randomUUID(), key: 'utm_source', value: 'google' },
        { parameterId: crypto.randomUUID(), key: 'utm_campaign', value: 'bf2024' },
      ],
      project_id: project.project_id,
    },
  })

  console.log('Seed concluído.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
