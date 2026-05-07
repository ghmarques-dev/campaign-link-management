import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IFetchProjectLinksUseCase } from '@/domain/use-cases/links'

export class FetchProjectLinksController {
  constructor(private readonly fetchProjectLinksUseCase: IFetchProjectLinksUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = z.object({ projectId: z.string() }).parse(req.params)

      const query = z.object({
        page: z.coerce.number().int().positive().default(1),
        pageSize: z.coerce.number().int().positive().max(100).default(10),
        name: z.string().optional(),
      }).parse(req.query)

      const { links, meta } = await this.fetchProjectLinksUseCase.execute({ projectId, ...query })

      return res.status(200).json({ data: links, meta })
    } catch (error: any) {
      next(error)
    }
  }
}
