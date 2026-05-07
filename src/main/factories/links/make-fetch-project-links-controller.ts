import { PrismaLinksRepository } from '@/infra/database/prisma/repositories'
import { FetchProjectLinksUseCase } from '@/application/use-cases/links'
import { FetchProjectLinksController } from '@/presentation/controllers/links'

export function makeFetchProjectLinksController() {
  const linksRepository = new PrismaLinksRepository()
  const useCase = new FetchProjectLinksUseCase(linksRepository)
  return new FetchProjectLinksController(useCase)
}
