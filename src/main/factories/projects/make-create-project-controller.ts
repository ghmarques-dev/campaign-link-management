import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { CreateProjectUseCase } from '@/application/use-cases/projects'
import { CreateProjectController } from '@/presentation/controllers/projects'

export function makeCreateProjectController() {
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new CreateProjectUseCase(projectsRepository)
  return new CreateProjectController(useCase)
}
