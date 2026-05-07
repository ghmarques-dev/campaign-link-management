import { Project } from '@/domain/entities'

export type ProjectsRepository = {
  create(input: ProjectsRepository.Create.Input): ProjectsRepository.Create.Output
  findManyByUserId(input: ProjectsRepository.FindManyByUserId.Input): ProjectsRepository.FindManyByUserId.Output
}

export namespace ProjectsRepository {
  export namespace Create {
    export type Input = { name: string; userId: string }
    export type Output = Promise<Project>
  }

  export namespace FindManyByUserId {
    export type Input = { userId: string }
    export type Output = Promise<Project[]>
  }
}
