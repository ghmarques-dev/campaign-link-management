import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProjectsRepository } from '@/application/repositories/database'
import { InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { IFetchUserProjectsUseCase } from '@/domain/use-cases/projects'

import { FetchUserProjectsUseCase } from './fetch-user-projects'

let projectsRepository: ProjectsRepository
let sut: IFetchUserProjectsUseCase

describe('fetch user projects use case', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository()
    sut = new FetchUserProjectsUseCase(projectsRepository)
  })

  it('should be able to fetch user projects with successful', async () => {
    await projectsRepository.create({ name: 'Project A', userId: 'userId-01' })
    await projectsRepository.create({ name: 'Project B', userId: 'userId-01' })

    const { projects } = await sut.execute({ userId: 'userId-01' })

    expect(projects).toHaveLength(2)
    expect(projects[0].name).toBe('Project A')
    expect(projects[1].name).toBe('Project B')
  })

  it('should be able to call findManyByUserId with the correct values', async () => {
    const spy = vi.spyOn(projectsRepository, 'findManyByUserId')

    await sut.execute({ userId: 'userId-01' })

    expect(spy).toHaveBeenCalledWith({ userId: 'userId-01' })
  })

  it('should be able to return empty array when no projects found', async () => {
    const { projects } = await sut.execute({ userId: 'userId-01' })

    expect(projects).toHaveLength(0)
  })
})
