import { IFetchUserProjectsUseCase } from '@/domain/use-cases/projects'
import { ProjectsRepository } from '@/application/repositories/database'

export class FetchUserProjectsUseCase implements IFetchUserProjectsUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute(input: IFetchUserProjectsUseCase.Input): IFetchUserProjectsUseCase.Output {
    const { projects, total } = await this.projectsRepository.findManyByUserId({
      userId: input.userId,
      page: input.page,
      pageSize: input.pageSize,
      name: input.name,
    })

    return {
      projects,
      meta: {
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.ceil(total / input.pageSize),
      },
    }
  }
}
