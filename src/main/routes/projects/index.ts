import { Router } from 'express'
import { verifyJwt } from '@/main/middlewares'
import { makeCreateProjectController } from '@/main/factories/projects'
import { makeFetchUserProjectsController } from '@/main/factories/projects'

export const projectsRoutes = Router()

projectsRoutes.use(verifyJwt)

projectsRoutes.post('/projects', (req, res, next) =>
  makeCreateProjectController().handle(req, res, next),
)
projectsRoutes.get('/projects', (req, res, next) =>
  makeFetchUserProjectsController().handle(req, res, next),
)
