import { Project } from '@/domain/entities'

export interface IFetchUserProjectsUseCase {
  execute(input: IFetchUserProjectsUseCase.Input): IFetchUserProjectsUseCase.Output
}

export namespace IFetchUserProjectsUseCase {
  export type Input = {
    userId: string
  }

  export type Output = Promise<{ projects: Project[] }>
}
