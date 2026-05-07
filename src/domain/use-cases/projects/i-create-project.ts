import { Project } from '@/domain/entities'

export interface ICreateProjectUseCase {
  execute(input: ICreateProjectUseCase.Input): ICreateProjectUseCase.Output
}

export namespace ICreateProjectUseCase {
  export type Input = {
    name: string
    userId: string
  }

  export type Output = Promise<Project>
}
