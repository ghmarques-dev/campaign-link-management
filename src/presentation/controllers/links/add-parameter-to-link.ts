import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IAddParameterToLinkUseCase } from '@/domain/use-cases/links'
import { LinkNotFoundError } from '@/application/errors/errors'

export class AddParameterToLinkController {
  constructor(private readonly addParameterToLinkUseCase: IAddParameterToLinkUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = z.object({ id: z.string() }).parse(req.params)
      const body = z.object({ key: z.string().min(1), value: z.string() }).parse(req.body)

      const parameter = await this.addParameterToLinkUseCase.execute({
        linkId: id,
        userId: req.userId,
        ...body,
      })

      return res.status(201).json({ parameter })
    } catch (error: any) {
      if (error instanceof LinkNotFoundError) {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  }
}
