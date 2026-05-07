import { IRemoveParameterFromLinkUseCase } from '@/domain/use-cases/links'
import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { LinkNotFoundError, ParameterNotFoundError } from '@/application/errors/errors'

export class RemoveParameterFromLinkUseCase implements IRemoveParameterFromLinkUseCase {
  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute(input: IRemoveParameterFromLinkUseCase.Input): IRemoveParameterFromLinkUseCase.Output {
    const link = await this.linksRepository.findById({ linkId: input.linkId })

    if (!link) throw new LinkNotFoundError()

    const project = await this.projectsRepository.findById({ projectId: link.projectId })

    if (!project || project.userId !== input.userId) throw new LinkNotFoundError()

    const parameter = link.parameters.find((p) => p.parameterId === input.parameterId)

    if (!parameter) throw new ParameterNotFoundError()

    await this.linksRepository.removeParameter({
      linkId: input.linkId,
      parameterId: input.parameterId,
    })
  }
}
