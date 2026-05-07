import { NextFunction, Request, Response } from 'express'
import { IFetchUserProjectsUseCase } from '@/domain/use-cases/projects'

export class FetchUserProjectsController {
  constructor(private readonly fetchUserProjectsUseCase: IFetchUserProjectsUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { projects } = await this.fetchUserProjectsUseCase.execute({ userId: req.userId })

      return res.status(200).json({ projects })
    } catch (error: any) {
      next(error)
    }
  }
}
