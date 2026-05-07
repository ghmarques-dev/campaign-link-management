import { IFetchProjectLinksUseCase } from '@/domain/use-cases/links'
import { LinksRepository } from '@/application/repositories/database'

export class FetchProjectLinksUseCase implements IFetchProjectLinksUseCase {
  constructor(private readonly linksRepository: LinksRepository) {}

  async execute(input: IFetchProjectLinksUseCase.Input): IFetchProjectLinksUseCase.Output {
    const links = await this.linksRepository.findManyByProjectId({ projectId: input.projectId })
    return { links }
  }
}
