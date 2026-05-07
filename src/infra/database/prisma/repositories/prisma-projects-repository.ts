import { ProjectsRepository } from '@/application/repositories/database'
import { Project } from '@/domain/entities'
import { prisma } from '@/infra/database/prisma'

export class PrismaProjectsRepository implements ProjectsRepository {
  async create(input: ProjectsRepository.Create.Input): ProjectsRepository.Create.Output {
    const project = await prisma.project.create({
      data: {
        name: input.name,
        user_id: input.userId,
      },
    })

    return this.toDomain(project)
  }

  async findManyByUserId(input: ProjectsRepository.FindManyByUserId.Input): ProjectsRepository.FindManyByUserId.Output {
    const projects = await prisma.project.findMany({
      where: { user_id: input.userId },
      orderBy: { created_at: 'desc' },
    })

    return projects.map(this.toDomain)
  }

  private toDomain(raw: {
    project_id: string
    name: string
    user_id: string
    created_at: Date
  }): Project {
    return {
      projectId: raw.project_id,
      name: raw.name,
      userId: raw.user_id,
      createdAt: raw.created_at,
    }
  }
}
