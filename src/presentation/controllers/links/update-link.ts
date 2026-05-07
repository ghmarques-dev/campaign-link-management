import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IUpdateLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

export class UpdateLinkController {
  constructor(private readonly updateLinkUseCase: IUpdateLinkUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = z.object({ id: z.string() }).parse(req.params)
      const body = z.object({
        name: z.string().min(1).optional(),
        baseUrl: z.string().url().optional(),
        redirectUrl: z.string().url().nullable().optional(),
      }).parse(req.body)

      const link = await this.updateLinkUseCase.execute({
        linkId: id,
        userId: req.userId,
        ...body,
      })

      return res.status(200).json({ link })
    } catch (error: any) {
      if (error instanceof LinkNotFoundError) {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  }
}
