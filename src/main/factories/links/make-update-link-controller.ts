import { PrismaLinksRepository, PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { UpdateLinkUseCase } from '@/application/use-cases/links'
import { UpdateLinkController } from '@/presentation/controllers/links'

export function makeUpdateLinkController() {
  const linksRepository = new PrismaLinksRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new UpdateLinkUseCase(linksRepository, projectsRepository)
  return new UpdateLinkController(useCase)
}
