import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LinksRepository, ProjectsRepository } from '@/application/repositories/database'
import { InMemoryLinksRepository, InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { IRemoveParameterFromLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError, ParameterNotFoundError } from '@/application/errors/errors'

import { RemoveParameterFromLinkUseCase } from './remove-parameter-from-link'

let linksRepository: LinksRepository
let projectsRepository: ProjectsRepository
let sut: IRemoveParameterFromLinkUseCase

describe('remove parameter from link use case', () => {
  beforeEach(async () => {
    linksRepository = new InMemoryLinksRepository()
    projectsRepository = new InMemoryProjectsRepository()
    sut = new RemoveParameterFromLinkUseCase(linksRepository, projectsRepository)

    await projectsRepository.create({ name: 'My Project', userId: 'userId-01' })
    await linksRepository.create({ name: 'My Link', baseUrl: 'https://example.com', projectId: 'projectId-01' })
    await linksRepository.addParameter({ linkId: 'linkId-01', parameterId: 'param-01', key: 'utm_source', value: 'FB' })
  })

  it('should be able to remove a parameter from a link with successful', async () => {
    await sut.execute({ linkId: 'linkId-01', parameterId: 'param-01', userId: 'userId-01' })

    const link = await linksRepository.findById({ linkId: 'linkId-01' })
    expect(link!.parameters).toHaveLength(0)
  })

  it('should be able to call removeParameter with the correct values', async () => {
    const spy = vi.spyOn(linksRepository, 'removeParameter')

    await sut.execute({ linkId: 'linkId-01', parameterId: 'param-01', userId: 'userId-01' })

    expect(spy).toHaveBeenCalledWith({ linkId: 'linkId-01', parameterId: 'param-01' })
  })

  it('should be able to throw LinkNotFoundError if link not found', async () => {
    await expect(
      sut.execute({ linkId: 'non-existent', parameterId: 'param-01', userId: 'userId-01' }),
    ).rejects.toBeInstanceOf(LinkNotFoundError)
  })

  it('should be able to throw LinkNotFoundError if link does not belong to user', async () => {
    await expect(
      sut.execute({ linkId: 'linkId-01', parameterId: 'param-01', userId: 'other-user' }),
    ).rejects.toBeInstanceOf(LinkNotFoundError)
  })

  it('should be able to throw ParameterNotFoundError if parameter not found', async () => {
    await expect(
      sut.execute({ linkId: 'linkId-01', parameterId: 'non-existent', userId: 'userId-01' }),
    ).rejects.toBeInstanceOf(ParameterNotFoundError)
  })
})
