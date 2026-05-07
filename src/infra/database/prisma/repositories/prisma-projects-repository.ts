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
    const where = {
      user_id: input.userId,
      ...(input.name && { name: { contains: input.name, mode: 'insensitive' as const } }),
    }

    const [rawProjects, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.project.count({ where }),
    ])

    return { projects: rawProjects.map(this.toDomain), total }
  }

  async findById(input: ProjectsRepository.FindById.Input): ProjectsRepository.FindById.Output {
    const project = await prisma.project.findUnique({ where: { project_id: input.projectId } })

    return project ? this.toDomain(project) : null
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
