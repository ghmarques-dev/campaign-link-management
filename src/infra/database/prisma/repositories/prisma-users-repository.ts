import { UsersRepository } from '@/application/repositories/database'
import { User } from '@/domain/entities'
import { prisma } from '@/infra/database/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async create(input: UsersRepository.Create.Input): UsersRepository.Create.Output {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    })

    return this.toDomain(user)
  }

  async findByEmail(input: UsersRepository.FindByEmail.Input): UsersRepository.FindByEmail.Output {
    const user = await prisma.user.findUnique({ where: { email: input.email } })

    return user ? this.toDomain(user) : null
  }

  async findById(input: UsersRepository.FindById.Input): UsersRepository.FindById.Output {
    const user = await prisma.user.findUnique({ where: { user_id: input.userId } })

    return user ? this.toDomain(user) : null
  }

  private toDomain(raw: {
    user_id: string
    name: string
    email: string
    password: string
    created_at: Date
  }): User {
    return {
      userId: raw.user_id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      createdAt: raw.created_at,
    }
  }
}
