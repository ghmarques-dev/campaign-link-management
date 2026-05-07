import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { InMemoryLinksRepository } from '@/infra/database/in-memory'
import { InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { ICreateLinkUseCase } from '@/domain/use-cases/links'
import { ProjectNotFoundError } from '@/application/errors/errors'

import { CreateLinkUseCase } from './create-link'

let linksRepository: LinksRepository
let projectsRepository: ProjectsRepository
let sut: ICreateLinkUseCase

describe('create link use case', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository()
    projectsRepository = new InMemoryProjectsRepository()
    sut = new CreateLinkUseCase(linksRepository, projectsRepository)
  })

  it('should be able to create a new link with successful', async () => {
    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })

    const link = await sut.execute({
      name: 'My Link',
      baseUrl: 'https://example.com',
      projectId: 'projectId-01',
      userId: 'userId-01',
    })

    expect(link.linkId).toBe('linkId-01')
    expect(link.name).toBe('My Link')
    expect(link.baseUrl).toBe('https://example.com')
    expect(link.redirectUrl).toBeNull()
    expect(link.parameters).toEqual([])
    expect(link.projectId).toBe('projectId-01')
  })

  it('should be able to call create with the correct values', async () => {
    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })

    const spy = vi.spyOn(linksRepository, 'create')

    await sut.execute({
      name: 'My Link',
      baseUrl: 'https://example.com',
      redirectUrl: 'https://destination.com',
      projectId: 'projectId-01',
      userId: 'userId-01',
    })

    expect(spy).toHaveBeenCalledWith({
      name: 'My Link',
      baseUrl: 'https://example.com',
      redirectUrl: 'https://destination.com',
      projectId: 'projectId-01',
    })
  })

  it('should be able to throw ProjectNotFoundError if project not found', async () => {
    await expect(
      sut.execute({
        name: 'My Link',
        baseUrl: 'https://example.com',
        projectId: 'non-existent',
        userId: 'userId-01',
      }),
    ).rejects.toBeInstanceOf(ProjectNotFoundError)
  })

  it('should be able to throw ProjectNotFoundError if project does not belong to user', async () => {
    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })

    await expect(
      sut.execute({
        name: 'My Link',
        baseUrl: 'https://example.com',
        projectId: 'projectId-01',
        userId: 'other-user',
      }),
    ).rejects.toBeInstanceOf(ProjectNotFoundError)
  })
})
