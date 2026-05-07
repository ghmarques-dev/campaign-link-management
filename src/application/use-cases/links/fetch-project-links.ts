import { IFetchProjectLinksUseCase } from '@/domain/use-cases/links'
import { LinksRepository } from '@/application/repositories/database'

export class FetchProjectLinksUseCase implements IFetchProjectLinksUseCase {
  constructor(private readonly linksRepository: LinksRepository) {}

  async execute(input: IFetchProjectLinksUseCase.Input): IFetchProjectLinksUseCase.Output {
    const { links, total } = await this.linksRepository.findManyByProjectId({
      projectId: input.projectId,
      page: input.page,
      pageSize: input.pageSize,
      name: input.name,
    })

    return {
      links,
      meta: {
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.ceil(total / input.pageSize),
      },
    }
  }
}
