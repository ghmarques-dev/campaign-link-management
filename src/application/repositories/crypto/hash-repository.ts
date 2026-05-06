export type HashRepository = {
  create(input: HashRepository.Create.Input): HashRepository.Create.Output
  compare(input: HashRepository.Compare.Input): HashRepository.Compare.Output
}

export namespace HashRepository {
  export namespace Create {
    export type Input = { string: string; salt: number }
    export type Output = Promise<string>
  }
  export namespace Compare {
    export type Input = { string: string; hash: string }
    export type Output = Promise<boolean>
  }
}
