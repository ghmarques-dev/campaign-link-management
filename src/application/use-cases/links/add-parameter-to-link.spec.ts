import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { InMemoryLinksRepository, InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { IAddParameterToLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

import { AddParameterToLinkUseCase } from './add-parameter-to-link'

let linksRepository: LinksRepository
let projectsRepository: ProjectsRepository
let sut: IAddParameterToLinkUseCase

describe('add parameter to link use case', () => {
  beforeEach(async () => {
    linksRepository = new InMemoryLinksRepository()
    projectsRepository = new InMemoryProjectsRepository()
    sut = new AddParameterToLinkUseCase(linksRepository, projectsRepository)

    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })
    await linksRepository.create({ name: 'My Link', baseUrl: 'https://example.com', projectId: 'projectId-01' })
  })

  it('should be able to add a parameter to a link with successful', async () => {
    const parameter = await sut.execute({
      linkId: 'linkId-01',
      key: 'utm_source',
      value: 'FB',
      userId: 'userId-01',
    })

    expect(parameter.parameterId).toBeDefined()
    expect(parameter.key).toBe('utm_source')
    expect(parameter.value).toBe('FB')

    const link = await linksRepository.findById({ linkId: 'linkId-01' })
    expect(link!.parameters).toHaveLength(1)
  })

  it('should be able to call addParameter with the correct values', async () => {
    const spy = vi.spyOn(linksRepository, 'addParameter')

    await sut.execute({ linkId: 'linkId-01', key: 'utm_source', value: 'FB', userId: 'userId-01' })

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ linkId: 'linkId-01', key: 'utm_source', value: 'FB' }),
    )
  })

  it('should be able to throw LinkNotFoundError if link not found', async () => {
    await expect(
      sut.execute({ linkId: 'non-existent', key: 'utm_source', value: 'FB', userId: 'userId-01' }),
    ).rejects.toBeInstanceOf(LinkNotFoundError)
  })

  it('should be able to throw LinkNotFoundError if link does not belong to user', async () => {
    await expect(
      sut.execute({ linkId: 'linkId-01', key: 'utm_source', value: 'FB', userId: 'other-user' }),
    ).rejects.toBeInstanceOf(LinkNotFoundError)
  })
})
