import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { InMemoryLinksRepository, InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { IGenerateLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

import { GenerateLinkUseCase } from './generate-link'

let linksRepository: LinksRepository
let projectsRepository: ProjectsRepository
let sut: IGenerateLinkUseCase

describe('generate link use case', () => {
  beforeEach(async () => {
    linksRepository = new InMemoryLinksRepository()
    projectsRepository = new InMemoryProjectsRepository()
    sut = new GenerateLinkUseCase(linksRepository, projectsRepository)

    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })
    await linksRepository.create({ name: 'My Link', baseUrl: 'https://tracker.example.com', projectId: 'projectId-01' })
  })

  it('should be able to generate a url with parameters', async () => {
    await linksRepository.addParameter({ linkId: 'linkId-01', parameterId: 'p-01', key: 'utm_source', value: 'FB' })
    await linksRepository.addParameter({ linkId: 'linkId-01', parameterId: 'p-02', key: 'utm_medium', value: 'cpc' })

    const { url } = await sut.execute({ linkId: 'linkId-01', userId: 'userId-01' })

    expect(url).toBe('https://tracker.example.com?utm_source=FB&utm_medium=cpc')
  })

  it('should be able to generate a url with redirect', async () => {
    await linksRepository.update({ linkId: 'linkId-01', redirectUrl: 'https://destination.com' })

    const { url } = await sut.execute({ linkId: 'linkId-01', userId: 'userId-01' })

    expect(url).toBe('https://tracker.example.com?redirect=https%3A%2F%2Fdestination.com')
  })

  it('should be able to generate a url with parameters and redirect', async () => {
    await linksRepository.addParameter({ linkId: 'linkId-01', parameterId: 'p-01', key: 'utm_source', value: 'FB' })
    await linksRepository.update({ linkId: 'linkId-01', redirectUrl: 'https://destination.com' })

    const { url } = await sut.execute({ linkId: 'linkId-01', userId: 'userId-01' })

    expect(url).toBe('https://tracker.example.com?utm_source=FB&redirect=https%3A%2F%2Fdestination.com')
  })

  it('should be able to generate a url without parameters and without redirect', async () => {
    const { url } = await sut.execute({ linkId: 'linkId-01', userId: 'userId-01' })

    expect(url).toBe('https://tracker.example.com')
  })

  it('should be able to call findById with the correct values', async () => {
    const spy = vi.spyOn(linksRepository, 'findById')

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
