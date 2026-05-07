import { PrismaLinksRepository, PrismaProjectsRepository } from '@/infra/database/prisma/repositories'
import { RemoveParameterFromLinkUseCase } from '@/application/use-cases/links'
import { RemoveParameterFromLinkController } from '@/presentation/controllers/links'

export function makeRemoveParameterFromLinkController() {
  const linksRepository = new PrismaLinksRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const useCase = new RemoveParameterFromLinkUseCase(linksRepository, projectsRepository)
  return new RemoveParameterFromLinkController(useCase)
}
