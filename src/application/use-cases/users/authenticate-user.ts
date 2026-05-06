import { IAuthenticateUserUseCase } from '@/domain/use-cases/users'
import { UsersRepository } from '@/application/repositories/database'
import { HashRepository } from '@/application/repositories/crypto'
import { InvalidCredentialsError } from '@/application/errors/errors'

export class AuthenticateUserUseCase implements IAuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashRepository: HashRepository,
  ) {}

  async execute(input: IAuthenticateUserUseCase.Input): IAuthenticateUserUseCase.Output {
    const user = await this.usersRepository.findByEmail({ email: input.email })

    if (!user) throw new InvalidCredentialsError()

    const passwordMatch = await this.hashRepository.compare({
      string: input.password,
      hash: user.password,
    })

    if (!passwordMatch) throw new InvalidCredentialsError()

    return { user }
  }
}
