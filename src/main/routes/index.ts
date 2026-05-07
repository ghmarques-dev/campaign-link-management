import { Router } from 'express'
import { usersRoutes } from './users'
import { projectsRoutes } from './projects'

export const routes = Router()

routes.use(usersRoutes)
routes.use(projectsRoutes)
