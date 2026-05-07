export interface IRemoveParameterFromLinkUseCase {
  execute(input: IRemoveParameterFromLinkUseCase.Input): IRemoveParameterFromLinkUseCase.Output
}

export namespace IRemoveParameterFromLinkUseCase {
  export type Input = {
    linkId: string
    parameterId: string
    userId: string
  }

  export type Output = Promise<void>
}
