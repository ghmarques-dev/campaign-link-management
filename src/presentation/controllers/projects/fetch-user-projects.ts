import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { IFetchUserProjectsUseCase } from '@/domain/use-cases/projects'

export class FetchUserProjectsController {
  constructor(private readonly fetchUserProjectsUseCase: IFetchUserProjectsUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const query = z.object({
        page: z.coerce.number().int().positive().default(1),
        pageSize: z.coerce.number().int().positive().max(100).default(10),
        name: z.string().optional(),
      }).parse(req.query)

      const { projects, meta } = await this.fetchUserProjectsUseCase.execute({
        userId: req.userId,
        ...query,
      })

      return res.status(200).json({ data: projects, meta })
    } catch (error: any) {
      next(error)
    }
  }
}
