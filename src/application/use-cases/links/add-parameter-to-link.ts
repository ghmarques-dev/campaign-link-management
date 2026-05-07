import { randomUUID } from 'crypto'
import { IAddParameterToLinkUseCase } from '@/domain/use-cases/links'
import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { LinkNotFoundError } from '@/application/errors/errors'

export class AddParameterToLinkUseCase implements IAddParameterToLinkUseCase {
  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute(input: IAddParameterToLinkUseCase.Input): IAddParameterToLinkUseCase.Output {
    const link = await this.linksRepository.findById({ linkId: input.linkId })

    if (!link) throw new LinkNotFoundError()

    const project = await this.projectsRepository.findById({ projectId: link.projectId })

    if (!project || project.userId !== input.userId) throw new LinkNotFoundError()

    const parameterId = randomUUID()

    await this.linksRepository.addParameter({
      linkId: input.linkId,
      parameterId,
      key: input.key,
      value: input.value,
    })

    return { parameterId, key: input.key, value: input.value }
  }
}
