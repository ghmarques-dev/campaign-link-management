import { ICreateProjectUseCase } from '@/domain/use-cases/projects'
import { ProjectsRepository } from '@/application/repositories/database'

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute(input: ICreateProjectUseCase.Input): ICreateProjectUseCase.Output {
    return this.projectsRepository.create({ name: input.name, userId: input.userId })
  }
}
