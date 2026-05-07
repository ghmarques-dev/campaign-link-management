import { PrismaLinksRepository, PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { DeleteLinkUseCase } from '@/application/use-cases/links'
import { DeleteLinkController } from '@/presentation/controllers/links'

export function makeDeleteLinkController() {
  const linksRepository = new PrismaLinksRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new DeleteLinkUseCase(linksRepository, projectsRepository)
  return new DeleteLinkController(useCase)
}
