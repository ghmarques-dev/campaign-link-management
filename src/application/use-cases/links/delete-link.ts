import { IDeleteLinkUseCase } from '@/domain/use-cases/links'
import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { LinkNotFoundError } from '@/application/errors/errors'

export class DeleteLinkUseCase implements IDeleteLinkUseCase {
  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute(input: IDeleteLinkUseCase.Input): IDeleteLinkUseCase.Output {
    const link = await this.linksRepository.findById({ linkId: input.linkId })

    if (!link) throw new LinkNotFoundError()

    const project = await this.projectsRepository.findById({ projectId: link.projectId })

    if (!project || project.userId !== input.userId) throw new LinkNotFoundError()

    await this.linksRepository.delete({ linkId: input.linkId })
  }
}
