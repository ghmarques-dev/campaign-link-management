import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { InMemoryLinksRepository, InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { IUpdateLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

import { UpdateLinkUseCase } from './update-link'

let linksRepository: LinksRepository
let projectsRepository: ProjectsRepository
let sut: IUpdateLinkUseCase

describe('update link use case', () => {
  beforeEach(async () => {
    linksRepository = new InMemoryLinksRepository()
    projectsRepository = new InMemoryProjectsRepository()
    sut = new UpdateLinkUseCase(linksRepository, projectsRepository)

    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })
    await linksRepository.create({ name: 'My Link', baseUrl: 'https://example.com', projectId: 'projectId-01' })
  })

  it('should be able to update a link with successful', async () => {
    const updated = await sut.execute({
      linkId: 'linkId-01',
      userId: 'userId-01',
      name: 'Updated Link',
      baseUrl: 'https://updated.com',
    })

    expect(updated.name).toBe('Updated Link')
    expect(updated.baseUrl).toBe('https://updated.com')
  })

  it('should be able to call update with the correct values', async () => {
    const spy = vi.spyOn(linksRepository, 'update')

    await sut.execute({ linkId: 'linkId-01', userId: 'userId-01', name: 'Updated' })

    expect(spy).toHaveBeenCalledWith({ linkId: 'linkId-01', name: 'Updated', baseUrl: undefined, redirectUrl: undefined })
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
