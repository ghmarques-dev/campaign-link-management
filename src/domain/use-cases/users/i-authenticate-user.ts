import { User } from '@/domain/entities'

export interface IAuthenticateUserUseCase {
  execute(input: IAuthenticateUserUseCase.Input): IAuthenticateUserUseCase.Output
}

export namespace IAuthenticateUserUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = Promise<{ user: User }>
}
