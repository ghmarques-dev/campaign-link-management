import { Link } from '@/domain/entities'

export interface ICreateLinkUseCase {
  execute(input: ICreateLinkUseCase.Input): ICreateLinkUseCase.Output
}

export namespace ICreateLinkUseCase {
  export type Input = {
    name: string
    baseUrl: string
    redirectUrl?: string | null
    projectId: string
    userId: string
  }

  export type Output = Promise<Link>
}
