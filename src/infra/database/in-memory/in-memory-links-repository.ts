import { LinksRepository } from '@/application/repositories/database'
import { Link } from '@/domain/entities'

export class InMemoryLinksRepository implements LinksRepository {
  private database: Link[] = []
  private counter = 0

  async create(input: LinksRepository.Create.Input): LinksRepository.Create.Output {
    this.counter++
    const link: Link = {
      linkId: `linkId-0${this.counter}`,
      name: input.name,
      baseUrl: input.baseUrl,
      redirectUrl: input.redirectUrl ?? null,
      parameters: [],
      projectId: input.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.database.push(link)

    return link
  }

  async findManyByProjectId(input: LinksRepository.FindManyByProjectId.Input): LinksRepository.FindManyByProjectId.Output {
    let results = this.database.filter((l) => l.projectId === input.projectId)

    if (input.name) {
      results = results.filter((l) => l.name.toLowerCase().includes(input.name!.toLowerCase()))
    }

    const total = results.length
    const links = results.slice((input.page - 1) * input.pageSize, input.page * input.pageSize)

    return { links, total }
  }

  async findById(input: LinksRepository.FindById.Input): LinksRepository.FindById.Output {
    return this.database.find((l) => l.linkId === input.linkId) ?? null
  }

  async update(input: LinksRepository.Update.Input): LinksRepository.Update.Output {
    const index = this.database.findIndex((l) => l.linkId === input.linkId)
    const link = this.database[index]

    const updated: Link = {
      ...link,
      name: input.name ?? link.name,
      baseUrl: input.baseUrl ?? link.baseUrl,
      redirectUrl: input.redirectUrl !== undefined ? input.redirectUrl : link.redirectUrl,
      updatedAt: new Date(),
    }

    this.database[index] = updated

    return updated
  }

  async delete(input: LinksRepository.Delete.Input): LinksRepository.Delete.Output {
    const index = this.database.findIndex((l) => l.linkId === input.linkId)
    this.database.splice(index, 1)
  }

  async addParameter(input: LinksRepository.AddParameter.Input): LinksRepository.AddParameter.Output {
    const link = this.database.find((l) => l.linkId === input.linkId)!
    link.parameters.push({ parameterId: input.parameterId, key: input.key, value: input.value })
    link.updatedAt = new Date()
  }

  async removeParameter(input: LinksRepository.RemoveParameter.Input): LinksRepository.RemoveParameter.Output {
    const link = this.database.find((l) => l.linkId === input.linkId)!
    link.parameters = link.parameters.filter((p) => p.parameterId !== input.parameterId)
    link.updatedAt = new Date()
  }
}
