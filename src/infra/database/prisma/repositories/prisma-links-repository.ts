import { LinksRepository } from '@/application/repositories/database'
import { Link, Parameter } from '@/domain/entities'
import { prisma } from '@/infra/database/prisma'

export class PrismaLinksRepository implements LinksRepository {
  async create(input: LinksRepository.Create.Input): LinksRepository.Create.Output {
    const link = await prisma.link.create({
      data: {
        name: input.name,
        base_url: input.baseUrl,
        redirect_url: input.redirectUrl ?? null,
        project_id: input.projectId,
      },
    })

    return this.toDomain(link)
  }

  async findManyByProjectId(input: LinksRepository.FindManyByProjectId.Input): LinksRepository.FindManyByProjectId.Output {
    const links = await prisma.link.findMany({
      where: { project_id: input.projectId },
      orderBy: { created_at: 'desc' },
    })

    return links.map(this.toDomain)
  }

  async findById(input: LinksRepository.FindById.Input): LinksRepository.FindById.Output {
    const link = await prisma.link.findUnique({ where: { link_id: input.linkId } })

    return link ? this.toDomain(link) : null
  }

  async update(input: LinksRepository.Update.Input): LinksRepository.Update.Output {
    const link = await prisma.link.update({
      where: { link_id: input.linkId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.baseUrl !== undefined && { base_url: input.baseUrl }),
        ...(input.redirectUrl !== undefined && { redirect_url: input.redirectUrl }),
      },
    })

    return this.toDomain(link)
  }

  async delete(input: LinksRepository.Delete.Input): LinksRepository.Delete.Output {
    await prisma.link.delete({ where: { link_id: input.linkId } })
  }

  async addParameter(input: LinksRepository.AddParameter.Input): LinksRepository.AddParameter.Output {
    const link = await prisma.link.findUniqueOrThrow({ where: { link_id: input.linkId } })
    const parameters = link.parameters as Parameter[]

    await prisma.link.update({
      where: { link_id: input.linkId },
      data: {
        parameters: [
          ...parameters,
          { parameterId: input.parameterId, key: input.key, value: input.value },
        ],
      },
    })
  }

  async removeParameter(input: LinksRepository.RemoveParameter.Input): LinksRepository.RemoveParameter.Output {
    const link = await prisma.link.findUniqueOrThrow({ where: { link_id: input.linkId } })
    const parameters = (link.parameters as Parameter[]).filter(
      (p) => p.parameterId !== input.parameterId,
    )

    await prisma.link.update({
      where: { link_id: input.linkId },
      data: { parameters },
    })
  }

  private toDomain(raw: {
    link_id: string
    name: string
    base_url: string
    redirect_url: string | null
    parameters: unknown
    project_id: string
    created_at: Date
    updated_at: Date
  }): Link {
    return {
      linkId: raw.link_id,
      name: raw.name,
      baseUrl: raw.base_url,
      redirectUrl: raw.redirect_url,
      parameters: (raw.parameters as Parameter[]) ?? [],
      projectId: raw.project_id,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    }
  }
}
