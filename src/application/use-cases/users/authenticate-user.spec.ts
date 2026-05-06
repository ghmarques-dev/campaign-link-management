import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UsersRepository } from '@/application/repositories/database'
import { HashRepository } from '@/application/repositories/crypto'
import { InMemoryUsersRepository } from '@/infra/database/in-memory'
import { InMemoryHashRepository } from '@/infra/crypto/in-memory'
import { IAuthenticateUserUseCase } from '@/domain/use-cases/users'
import { InvalidCredentialsError } from '@/application/errors/errors'

import { AuthenticateUserUseCase } from './authenticate-user'

let usersRepository: UsersRepository
let hashRepository: HashRepository
let sut: IAuthenticateUserUseCase

describe('authenticate user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashRepository = new InMemoryHashRepository()
    sut = new AuthenticateUserUseCase(usersRepository, hashRepository)
  })

  it('should be able to authenticate user with successful', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    const { user } = await sut.execute({ email: 'john@example.com', password: 'password123' })

    expect(user.userId).toBe('userId-01')
    expect(user.email).toBe('john@example.com')
  })

  it('should be able to call findByEmail with the correct values', async () => {
    const spy = vi.spyOn(usersRepository, 'findByEmail')

    await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    await sut.execute({ email: 'john@example.com', password: 'password123' })

    expect(spy).toHaveBeenCalledWith({ email: 'john@example.com' })
  })

  it('should be able to call hash compare with the correct values', async () => {
    const spy = vi.spyOn(hashRepository, 'compare')

    await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    await sut.execute({ email: 'john@example.com', password: 'password123' })

    expect(spy).toHaveBeenCalledWith({ string: 'password123', hash: 'password123' })
  })

  it('should be able to return an error if user not found', async () => {
    await expect(
      sut.execute({ email: 'notfound@example.com', password: 'password123' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to return an error if password is invalid', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    await expect(
      sut.execute({ email: 'john@example.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
