import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProjectsRepository } from '@/application/repositories/database'
import { InMemoryProjectsRepository } from '@/infra/database/in-memory'
import { ICreateProjectUseCase } from '@/domain/use-cases/projects'

import { CreateProjectUseCase } from './create-project'

let projectsRepository: ProjectsRepository
let sut: ICreateProjectUseCase

describe('create project use case', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository()
    sut = new CreateProjectUseCase(projectsRepository)
  })

  it('should be able to create a new project with successful', async () => {
    const project = await sut.execute({ name: 'My Campaign', userId: 'userId-01' })

    expect(project.projectId).toBe('projectId-01')
    expect(project.name).toBe('My Campaign')
    expect(project.userId).toBe('userId-01')
    expect(project.createdAt).toBeDefined()
  })

  it('should be able to call create with the correct values', async () => {
    const spy = vi.spyOn(projectsRepository, 'create')

    await sut.execute({ name: 'My Campaign', userId: 'userId-01' })

    expect(spy).toHaveBeenCalledWith({ name: 'My Campaign', userId: 'userId-01' })
  })
})
