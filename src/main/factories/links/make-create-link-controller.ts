import { PrismaLinksRepository, PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { CreateLinkUseCase } from '@/application/use-cases/links'
import { CreateLinkController } from '@/presentation/controllers/links'

export function makeCreateLinkController() {
  const linksRepository = new PrismaLinksRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new CreateLinkUseCase(linksRepository, projectsRepository)
  return new CreateLinkController(useCase)
}
