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

    const { links, meta } = await sut.execute({ projectId: 'projectId-01', page: 1, pageSize: 10 })

    expect(links).toHaveLength(2)
    expect(links[0].name).toBe('Link A')
    expect(links[1].name).toBe('Link B')
    expect(meta.total).toBe(2)
    expect(meta.page).toBe(1)
    expect(meta.pageSize).toBe(10)
    expect(meta.totalPages).toBe(1)
  })

  it('should be able to call findManyByProjectId with the correct values', async () => {
    const spy = vi.spyOn(linksRepository, 'findManyByProjectId')

    await sut.execute({ projectId: 'projectId-01', page: 1, pageSize: 10 })

    expect(spy).toHaveBeenCalledWith({ projectId: 'projectId-01', page: 1, pageSize: 10, name: undefined })
  })

  it('should be able to return empty array when no links found', async () => {
    const { links, meta } = await sut.execute({ projectId: 'projectId-01', page: 1, pageSize: 10 })

    expect(links).toHaveLength(0)
    expect(meta.total).toBe(0)
    expect(meta.totalPages).toBe(0)
  })

  it('should be able to paginate results', async () => {
    for (let i = 1; i <= 15; i++) {
      await linksRepository.create({ name: `Link ${i}`, baseUrl: `https://link${i}.com`, projectId: 'projectId-01' })
    }

    const { links, meta } = await sut.execute({ projectId: 'projectId-01', page: 2, pageSize: 10 })

    expect(links).toHaveLength(5)
    expect(meta.total).toBe(15)
    expect(meta.totalPages).toBe(2)
  })

  it('should be able to filter links by name', async () => {
    await linksRepository.create({ name: 'Facebook Ads', baseUrl: 'https://a.com', projectId: 'projectId-01' })
    await linksRepository.create({ name: 'Google Ads', baseUrl: 'https://b.com', projectId: 'projectId-01' })

    const { links, meta } = await sut.execute({ projectId: 'projectId-01', page: 1, pageSize: 10, name: 'facebook' })

    expect(links).toHaveLength(1)
    expect(links[0].name).toBe('Facebook Ads')
    expect(meta.total).toBe(1)
  })
})
