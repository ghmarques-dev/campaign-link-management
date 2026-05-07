import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IDeleteLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

export class DeleteLinkController {
  constructor(private readonly deleteLinkUseCase: IDeleteLinkUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = z.object({ id: z.string() }).parse(req.params)

      await this.deleteLinkUseCase.execute({ linkId: id, userId: req.userId })

      return res.status(204).send()
    } catch (error: any) {
      if (error instanceof LinkNotFoundError) {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  }
}
