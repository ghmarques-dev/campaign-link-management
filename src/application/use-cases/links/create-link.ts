import { ICreateLinkUseCase } from '@/domain/use-cases/links'
import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { ProjectNotFoundError } from '@/application/errors/errors'

export class CreateLinkUseCase implements ICreateLinkUseCase {
  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute(input: ICreateLinkUseCase.Input): ICreateLinkUseCase.Output {
    const project = await this.projectsRepository.findById({ projectId: input.projectId })

    if (!project || project.userId !== input.userId) throw new ProjectNotFoundError()

    return this.linksRepository.create({
      name: input.name,
      baseUrl: input.baseUrl,
      redirectUrl: input.redirectUrl ?? null,
      projectId: input.projectId,
    })
  }
}
