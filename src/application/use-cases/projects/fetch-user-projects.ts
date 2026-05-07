import { IFetchUserProjectsUseCase } from '@/domain/use-cases/projects'
import { ProjectsRepository } from '@/application/repositories/database'

export class FetchUserProjectsUseCase implements IFetchUserProjectsUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute(input: IFetchUserProjectsUseCase.Input): IFetchUserProjectsUseCase.Output {
    const projects = await this.projectsRepository.findManyByUserId({ userId: input.userId })
    return { projects }
  }
}
