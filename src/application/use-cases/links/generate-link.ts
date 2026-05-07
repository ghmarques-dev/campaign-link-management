import { IGenerateLinkUseCase } from '@/domain/use-cases/links'
import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { LinkNotFoundError } from '@/application/errors/errors'

export class GenerateLinkUseCase implements IGenerateLinkUseCase {
  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute(input: IGenerateLinkUseCase.Input): IGenerateLinkUseCase.Output {
    const link = await this.linksRepository.findById({ linkId: input.linkId })

    if (!link) throw new LinkNotFoundError()

    const project = await this.projectsRepository.findById({ projectId: link.projectId })

    if (!project || project.userId !== input.userId) throw new LinkNotFoundError()

    const params = link.parameters.map(
      (p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`,
    )

    if (link.redirectUrl) {
      params.push(`redirect=${encodeURIComponent(link.redirectUrl)}`)
    }

    const url = params.length > 0 ? `${link.baseUrl}?${params.join('&')}` : link.baseUrl

    return { url }
  }
}
