import { Link } from '@/domain/entities'

export interface IFetchProjectLinksUseCase {
  execute(input: IFetchProjectLinksUseCase.Input): IFetchProjectLinksUseCase.Output
}

export namespace IFetchProjectLinksUseCase {
  export type Input = {
    projectId: string
    page: number
    pageSize: number
    name?: string
  }

  export type Output = Promise<{
    links: Link[]
    meta: { total: number; page: number; pageSize: number; totalPages: number }
  }>
}
