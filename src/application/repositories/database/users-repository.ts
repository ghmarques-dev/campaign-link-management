import { User } from '@/domain/entities'

export type UsersRepository = {
  create(input: UsersRepository.Create.Input): UsersRepository.Create.Output
  findByEmail(input: UsersRepository.FindByEmail.Input): UsersRepository.FindByEmail.Output
  findById(input: UsersRepository.FindById.Input): UsersRepository.FindById.Output
}

export namespace UsersRepository {
  export namespace Create {
    export type Input = { name: string; email: string; password: string }
    export type Output = Promise<User>
  }
  export namespace FindByEmail {
    export type Input = { email: string }
    export type Output = Promise<User | null>
  }
  export namespace FindById {
    export type Input = { userId: string }
    export type Output = Promise<User | null>
  }
}
