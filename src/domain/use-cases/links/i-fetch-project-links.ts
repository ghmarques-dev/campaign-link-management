import { Link } from '@/domain/entities'

export interface IFetchProjectLinksUseCase {
  execute(input: IFetchProjectLinksUseCase.Input): IFetchProjectLinksUseCase.Output
}

export namespace IFetchProjectLinksUseCase {
  export type Input = {
    projectId: string
  }

  export type Output = Promise<{ links: Link[] }>
}
