import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UsersRepository } from '@/application/repositories/database'
import { HashRepository } from '@/application/repositories/crypto'
import { InMemoryUsersRepository } from '@/infra/database/in-memory'
import { InMemoryHashRepository } from '@/infra/crypto/in-memory'
import { ICreateUserUseCase } from '@/domain/use-cases/users'
import { EmailAlreadyExistError } from '@/application/errors/errors'

import { CreateUserUseCase } from './create-user'

let usersRepository: UsersRepository
let hashRepository: HashRepository
let sut: ICreateUserUseCase

describe('create user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashRepository = new InMemoryHashRepository()
    sut = new CreateUserUseCase(usersRepository, hashRepository)
  })

  it('should be able to create a new user with successful', async () => {
    const user = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(user.userId).toBe('userId-01')
    expect(user.email).toBe('john@example.com')
    expect(user.createdAt).toBeDefined()
  })

  it('should be able to call findByEmail with the correct values', async () => {
    const spy = vi.spyOn(usersRepository, 'findByEmail')

    await sut.execute({ name: 'John Doe', email: 'john@example.com', password: 'password123' })

    expect(spy).toHaveBeenCalledWith({ email: 'john@example.com' })
  })

  it('should be able to call hash create with the correct values', async () => {
    const spy = vi.spyOn(hashRepository, 'create')

    await sut.execute({ name: 'John Doe', email: 'john@example.com', password: 'password123' })

    expect(spy).toHaveBeenCalledWith({ string: 'password123', salt: 6 })
  })

  it('should be able to return an error email already exists', async () => {
    vi.spyOn(usersRepository, 'findByEmail').mockImplementationOnce(async () => ({
      userId: 'userId-01',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed',
      createdAt: new Date(),
    }))

    await expect(
      sut.execute({ name: 'John Doe', email: 'john@example.com', password: 'password123' }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistError)
  })
})
