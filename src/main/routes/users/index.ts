import { Router } from 'express'
import { makeCreateUserController } from '@/main/factories/users'
import { makeAuthenticateUserController } from '@/main/factories/users'

export const usersRoutes = Router()

usersRoutes.post('/users', (req, res, next) => makeCreateUserController().handle(req, res, next))
usersRoutes.post('/sessions', (req, res, next) =>
  makeAuthenticateUserController().handle(req, res, next),
)
