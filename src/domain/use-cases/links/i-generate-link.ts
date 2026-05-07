export interface IGenerateLinkUseCase {
  execute(input: IGenerateLinkUseCase.Input): IGenerateLinkUseCase.Output
}

export namespace IGenerateLinkUseCase {
  export type Input = { linkId: string; userId: string }
  export type Output = Promise<{ url: string }>
}
