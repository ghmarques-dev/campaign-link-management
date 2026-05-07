import { Router } from 'express'
import { usersRoutes } from './users'
import { projectsRoutes } from './projects'
import { linksRoutes } from './links'

export const routes = Router()

routes.use(usersRoutes)
routes.use(projectsRoutes)
routes.use(linksRoutes)
