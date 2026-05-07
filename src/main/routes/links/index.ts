import { Router } from 'express'
import { verifyJwt } from '@/main/middlewares'
import { makeCreateLinkController } from '@/main/factories/links'
import { makeFetchProjectLinksController } from '@/main/factories/links'
import { makeUpdateLinkController } from '@/main/factories/links'
import { makeDeleteLinkController } from '@/main/factories/links'

export const linksRoutes = Router()

linksRoutes.use(verifyJwt)

linksRoutes.post('/projects/:projectId/links', (req, res, next) =>
  makeCreateLinkController().handle(req, res, next),
)
linksRoutes.get('/projects/:projectId/links', (req, res, next) =>
  makeFetchProjectLinksController().handle(req, res, next),
)
linksRoutes.patch('/links/:id', (req, res, next) =>
  makeUpdateLinkController().handle(req, res, next),
)
linksRoutes.delete('/links/:id', (req, res, next) =>
  makeDeleteLinkController().handle(req, res, next),
)
