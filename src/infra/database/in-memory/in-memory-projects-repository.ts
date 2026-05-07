import { ProjectsRepository } from '@/application/repositories/database'
import { Project } from '@/domain/entities'

export class InMemoryProjectsRepository implements ProjectsRepository {
  private database: Project[] = []
  private counter = 0

  async create(input: ProjectsRepository.Create.Input): ProjectsRepository.Create.Output {
    this.counter++
    const project: Project = {
      projectId: `projectId-0${this.counter}`,
      name: input.name,
      userId: input.userId,
      createdAt: new Date(),
    }

    this.database.push(project)

    return project
  }

  async findManyByUserId(input: ProjectsRepository.FindManyByUserId.Input): ProjectsRepository.FindManyByUserId.Output {
    let results = this.database.filter((p) => p.userId === input.userId)

    if (input.name) {
      results = results.filter((p) => p.name.toLowerCase().includes(input.name!.toLowerCase()))
    }

    const total = results.length
    const projects = results.slice((input.page - 1) * input.pageSize, input.page * input.pageSize)

    return { projects, total }
  }

  async findById(input: ProjectsRepository.FindById.Input): ProjectsRepository.FindById.Output {
    return this.database.find((p) => p.projectId === input.projectId) ?? null
  }
}
