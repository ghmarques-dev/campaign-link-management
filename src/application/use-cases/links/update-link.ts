import { IUpdateLinkUseCase } from '@/domain/use-cases/links'
import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { LinkNotFoundError } from '@/application/errors/errors'

export class UpdateLinkUseCase implements IUpdateLinkUseCase {
  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute(input: IUpdateLinkUseCase.Input): IUpdateLinkUseCase.Output {
    const link = await this.linksRepository.findById({ linkId: input.linkId })

    if (!link) throw new LinkNotFoundError()

    const project = await this.projectsRepository.findById({ projectId: link.projectId })

    if (!project || project.userId !== input.userId) throw new LinkNotFoundError()

    return this.linksRepository.update({
      linkId: input.linkId,
      name: input.name,
      baseUrl: input.baseUrl,
      redirectUrl: input.redirectUrl,
    })
  }
}
