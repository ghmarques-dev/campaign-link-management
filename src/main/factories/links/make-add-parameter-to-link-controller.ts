import { PrismaLinksRepository, PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { AddParameterToLinkUseCase } from '@/application/use-cases/links'
import { AddParameterToLinkController } from '@/presentation/controllers/links'

export function makeAddParameterToLinkController() {
  const linksRepository = new PrismaLinksRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new AddParameterToLinkUseCase(linksRepository, projectsRepository)
  return new AddParameterToLinkController(useCase)
}
