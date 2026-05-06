import { User } from '@/domain/entities'

export interface ICreateUserUseCase {
  execute(input: ICreateUserUseCase.Input): ICreateUserUseCase.Output
}

export namespace ICreateUserUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = Promise<User>
}
