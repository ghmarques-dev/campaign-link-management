import { UsersRepository } from '@/application/repositories/database'
import { User } from '@/domain/entities'

export class InMemoryUsersRepository implements UsersRepository {
  private database: User[] = []

  async create(input: UsersRepository.Create.Input): UsersRepository.Create.Output {
    const user: User = {
      userId: 'userId-01',
      name: input.name,
      email: input.email,
      password: input.password,
      createdAt: new Date(),
    }

    this.database.push(user)

    return user
  }

  async findByEmail(input: UsersRepository.FindByEmail.Input): UsersRepository.FindByEmail.Output {
    return this.database.find((u) => u.email === input.email) ?? null
  }

  async findById(input: UsersRepository.FindById.Input): UsersRepository.FindById.Output {
    return this.database.find((u) => u.userId === input.userId) ?? null
  }
}
