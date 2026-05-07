import { Project } from '@/domain/entities'

export type ProjectsRepository = {
  create(input: ProjectsRepository.Create.Input): ProjectsRepository.Create.Output
  findManyByUserId(input: ProjectsRepository.FindManyByUserId.Input): ProjectsRepository.FindManyByUserId.Output
  findById(input: ProjectsRepository.FindById.Input): ProjectsRepository.FindById.Output
}

export namespace ProjectsRepository {
  export namespace Create {
    export type Input = { name: string; userId: string }
    export type Output = Promise<Project>
  }

  export namespace FindManyByUserId {
    export type Input = { userId: string; page: number; pageSize: number; name?: string }
    export type Output = Promise<{ projects: Project[]; total: number }>
  }

  export namespace FindById {
    export type Input = { projectId: string }
    export type Output = Promise<Project | null>
  }
}
