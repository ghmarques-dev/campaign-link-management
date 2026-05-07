import { Project } from '@/domain/entities'

export interface IFetchUserProjectsUseCase {
  execute(input: IFetchUserProjectsUseCase.Input): IFetchUserProjectsUseCase.Output
}

export namespace IFetchUserProjectsUseCase {
  export type Input = {
    userId: string
    page: number
    pageSize: number
    name?: string
  }

  export type Output = Promise<{
    projects: Project[]
    meta: { total: number; page: number; pageSize: number; totalPages: number }
  }>
}
