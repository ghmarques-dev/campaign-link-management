import { Parameter } from '@/domain/entities'

export interface IAddParameterToLinkUseCase {
  execute(input: IAddParameterToLinkUseCase.Input): IAddParameterToLinkUseCase.Output
}

export namespace IAddParameterToLinkUseCase {
  export type Input = {
    linkId: string
    key: string
    value: string
    userId: string
  }

  export type Output = Promise<Parameter>
}
