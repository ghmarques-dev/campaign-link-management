import { PrismaLinksRepository, PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { GenerateLinkUseCase } from '@/application/use-cases/links'
import { GenerateLinkController } from '@/presentation/controllers/links'

export function makeGenerateLinkController() {
  const linksRepository = new PrismaLinksRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new GenerateLinkUseCase(linksRepository, projectsRepository)
  return new GenerateLinkController(useCase)
}
