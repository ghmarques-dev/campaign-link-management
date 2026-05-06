import { PrismaUsersRepository } from '@/infra/database/prisma/repositories'
import { BcryptHashRepository } from '@/infra/crypto/bcrypt'
import { CreateUserUseCase } from '@/application/use-cases/users'
import { CreateUserController } from '@/presentation/controllers/users'

export function makeCreateUserController() {
  const usersRepository = new PrismaUsersRepository()
  const hashRepository = new BcryptHashRepository()
  const useCase = new CreateUserUseCase(usersRepository, hashRepository)
  return new CreateUserController(useCase)
}
