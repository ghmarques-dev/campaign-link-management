import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { FetchUserProjectsUseCase } from '@/application/use-cases/projects'
import { FetchUserProjectsController } from '@/presentation/controllers/projects'

export function makeFetchUserProjectsController() {
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new FetchUserProjectsUseCase(projectsRepository)
  return new FetchUserProjectsController(useCase)
}
