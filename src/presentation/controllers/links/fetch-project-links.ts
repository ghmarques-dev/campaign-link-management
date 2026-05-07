import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IFetchProjectLinksUseCase } from '@/domain/use-cases/links'

export class FetchProjectLinksController {
  constructor(private readonly fetchProjectLinksUseCase: IFetchProjectLinksUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = z.object({ projectId: z.string() }).parse(req.params)

      const { links } = await this.fetchProjectLinksUseCase.execute({ projectId })

      return res.status(200).json({ links })
    } catch (error: any) {
      next(error)
    }
  }
}
