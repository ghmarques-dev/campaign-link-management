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

    const { projects, meta } = await sut.execute({ userId: 'userId-01', page: 1, pageSize: 10 })

    expect(projects).toHaveLength(2)
    expect(projects[0].name).toBe('Project A')
    expect(projects[1].name).toBe('Project B')
    expect(meta.total).toBe(2)
    expect(meta.page).toBe(1)
    expect(meta.pageSize).toBe(10)
    expect(meta.totalPages).toBe(1)
  })

  it('should be able to call findManyByUserId with the correct values', async () => {
    const spy = vi.spyOn(projectsRepository, 'findManyByUserId')

    await sut.execute({ userId: 'userId-01', page: 1, pageSize: 10 })

    expect(spy).toHaveBeenCalledWith({ userId: 'userId-01', page: 1, pageSize: 10, name: undefined })
  })

  it('should be able to return empty array when no projects found', async () => {
    const { projects, meta } = await sut.execute({ userId: 'userId-01', page: 1, pageSize: 10 })

    expect(projects).toHaveLength(0)
    expect(meta.total).toBe(0)
    expect(meta.totalPages).toBe(0)
  })

  it('should be able to paginate results', async () => {
    for (let i = 1; i <= 15; i++) {
      await projectsRepository.create({ name: `Project ${i}`, userId: 'userId-01' })
    }

    const { projects, meta } = await sut.execute({ userId: 'userId-01', page: 2, pageSize: 10 })

    expect(projects).toHaveLength(5)
    expect(meta.total).toBe(15)
    expect(meta.totalPages).toBe(2)
  })

  it('should be able to filter projects by name', async () => {
    await projectsRepository.create({ name: 'Black Friday', userId: 'userId-01' })
    await projectsRepository.create({ name: 'Cyber Monday', userId: 'userId-01' })

    const { projects, meta } = await sut.execute({ userId: 'userId-01', page: 1, pageSize: 10, name: 'black' })

    expect(projects).toHaveLength(1)
    expect(projects[0].name).toBe('Black Friday')
    expect(meta.total).toBe(1)
  })
})
