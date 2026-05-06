import { PrismaUsersRepository } from '@/infra/database/prisma/repositories'
import { BcryptHashRepository } from '@/infra/crypto/bcrypt'
import { AuthenticateUserUseCase } from '@/application/use-cases/users'
import { AuthenticateUserController } from '@/presentation/controllers/users'

export function makeAuthenticateUserController() {
  const usersRepository = new PrismaUsersRepository()
  const hashRepository = new BcryptHashRepository()
  const useCase = new AuthenticateUserUseCase(usersRepository, hashRepository)
  return new AuthenticateUserController(useCase)
}
