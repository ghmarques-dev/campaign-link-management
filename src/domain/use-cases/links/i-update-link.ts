import { Link } from '@/domain/entities'

export interface IUpdateLinkUseCase {
  execute(input: IUpdateLinkUseCase.Input): IUpdateLinkUseCase.Output
}

export namespace IUpdateLinkUseCase {
  export type Input = {
    linkId: string
    userId: string
    name?: string
    baseUrl?: string
    redirectUrl?: string | null
  }

  export type Output = Promise<Link>
}
