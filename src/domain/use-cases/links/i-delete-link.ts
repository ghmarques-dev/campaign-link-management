export interface IDeleteLinkUseCase {
  execute(input: IDeleteLinkUseCase.Input): IDeleteLinkUseCase.Output
}

export namespace IDeleteLinkUseCase {
  export type Input = {
    linkId: string
    userId: string
  }

  export type Output = Promise<void>
}
