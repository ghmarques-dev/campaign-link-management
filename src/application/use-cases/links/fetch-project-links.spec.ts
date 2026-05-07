import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LinksRepository } from '@/application/repositories/database'
import { InMemoryLinksRepository } from '@/infra/database/in-memory'
import { IFetchProjectLinksUseCase } from '@/domain/use-cases/links'

import { FetchProjectLinksUseCase } from './fetch-project-links'

let linksRepository: LinksRepository
let sut: IFetchProjectLinksUseCase

describe('fetch project links use case', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository()
    sut = new FetchProjectLinksUseCase(linksRepository)
  })

  it('should be able to fetch project links with successful', async () => {
    await linksRepository.create({ name: 'Link A', baseUrl: 'https://a.com', projectId: 'projectId-01' })
    await linksRepository.create({ name: 'Link B', baseUrl: 'https://b.com', projectId: 'projectId-01' })

    const { links } = await sut.execute({ projectId: 'projectId-01' })

    expect(links).toHaveLength(2)
    expect(links[0].name).toBe('Link A')
    expect(links[1].name).toBe('Link B')
  })

  it('should be able to call findManyByProjectId with the correct values', async () => {
    const spy = vi.spyOn(linksRepository, 'findManyByProjectId')

    await sut.execute({ projectId: 'projectId-01' })

    expect(spy).toHaveBeenCalledWith({ projectId: 'projectId-01' })
  })

  it('should be able to return empty array when no links found', async () => {
    const { links } = await sut.execute({ projectId: 'projectId-01' })

    expect(links).toHaveLength(0)
  })
})
