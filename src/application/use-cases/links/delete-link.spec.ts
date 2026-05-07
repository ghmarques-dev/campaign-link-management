import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { InMemoryLinksRepository, InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { IDeleteLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

import { DeleteLinkUseCase } from './delete-link'

let linksRepository: LinksRepository
let projectsRepository: ProjectsRepository
let sut: IDeleteLinkUseCase

describe('delete link use case', () => {
  beforeEach(async () => {
    linksRepository = new InMemoryLinksRepository()
    projectsRepository = new InMemoryProjectsRepository()
    sut = new DeleteLinkUseCase(linksRepository, projectsRepository)

    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })
    await linksRepository.create({ name: 'My Link', baseUrl: 'https://example.com', projectId: 'projectId-01' })
  })

  it('should be able to delete a link with successful', async () => {
    const spy = vi.spyOn(linksRepository, 'delete')

    await sut.execute({ linkId: 'linkId-01', userId: 'userId-01' })

    expect(spy).toHaveBeenCalledWith({ linkId: 'linkId-01' })
  })

  it('should be able to throw LinkNotFoundError if link not found', async () => {
    await expect(
      sut.execute({ linkId: 'non-existent', userId: 'userId-01' }),
    ).rejects.toBeInstanceOf(LinkNotFoundError)
  })

  it('should be able to throw LinkNotFoundError if link does not belong to user', async () => {
    await expect(
      sut.execute({ linkId: 'linkId-01', userId: 'other-user' }),
    ).rejects.toBeInstanceOf(LinkNotFoundError)
  })
})
