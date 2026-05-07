import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { ICreateLinkUseCase } from '@/domain/use-cases/links'
import { ProjectNotFoundError } from '@/application/errors/errors'

export class CreateLinkController {
  constructor(private readonly createLinkUseCase: ICreateLinkUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const params = z.object({ projectId: z.string() }).parse(req.params)
      const body = z.object({
        name: z.string().min(1),
        baseUrl: z.string().url(),
        redirectUrl: z.string().url().optional().nullable(),
      }).parse(req.body)

      const link = await this.createLinkUseCase.execute({
        ...body,
        projectId: params.projectId,
        userId: req.userId,
      })

      return res.status(201).json({ link })
    } catch (error: any) {
      if (error instanceof ProjectNotFoundError) {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  }
}
