import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { ICreateUserUseCase } from '@/domain/use-cases/users'
import { EmailAlreadyExistError } from '@/application/errors/errors'
import { env } from '@/infra/env'

export class CreateUserController {
  constructor(private readonly createUserUseCase: ICreateUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const body = z
        .object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        })
        .parse(req.body)

      const user = await this.createUserUseCase.execute(body)
      const token = jwt.sign({ sub: user.userId }, env.JWT_SECRET, { expiresIn: '1d' })

      return res.status(201).json({ token })
    } catch (error: any) {
      if (error instanceof EmailAlreadyExistError) {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  }
}
