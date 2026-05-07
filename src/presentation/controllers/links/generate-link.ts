import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IGenerateLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

export class GenerateLinkController {
  constructor(private readonly generateLinkUseCase: IGenerateLinkUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = z.object({ id: z.string() }).parse(req.params)

      const { url } = await this.generateLinkUseCase.execute({ linkId: id, userId: req.userId })

      return res.status(200).json({ url })
    } catch (error: any) {
      if (error instanceof LinkNotFoundError) {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  }
}
