import { ICreateUserUseCase } from '@/domain/use-cases/users'
import { UsersRepository } from '@/application/repositories/database'
import { HashRepository } from '@/application/repositories/crypto'
import { EmailAlreadyExistError } from '@/application/errors/errors'

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashRepository: HashRepository,
  ) {}

  async execute(input: ICreateUserUseCase.Input): ICreateUserUseCase.Output {
    const existing = await this.usersRepository.findByEmail({ email: input.email })

    if (existing) throw new EmailAlreadyExistError()

    const password = await this.hashRepository.create({ string: input.password, salt: 6 })

    return this.usersRepository.create({ name: input.name, email: input.email, password })
  }
}
