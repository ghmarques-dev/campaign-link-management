import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IRemoveParameterFromLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError, ParameterNotFoundError } from '@/application/errors/errors'

export class RemoveParameterFromLinkController {
  constructor(private readonly removeParameterFromLinkUseCase: IRemoveParameterFromLinkUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, parameterId } = z
        .object({ id: z.string(), parameterId: z.string() })
        .parse(req.params)

      await this.removeParameterFromLinkUseCase.execute({
        linkId: id,
        parameterId,
        userId: req.userId,
      })

      return res.status(204).send()
    } catch (error: any) {
      if (error instanceof LinkNotFoundError || error instanceof ParameterNotFoundError) {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  }
}
