import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { ICreateProjectUseCase } from '@/domain/use-cases/projects'

export class CreateProjectController {
  constructor(private readonly createProjectUseCase: ICreateProjectUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const body = z.object({ name: z.string().min(1) }).parse(req.body)

      const project = await this.createProjectUseCase.execute({
        name: body.name,
        userId: req.userId,
      })

      return res.status(201).json({ project })
    } catch (error: any) {
      next(error)
    }
  }
}
