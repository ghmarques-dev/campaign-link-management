import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { IAuthenticateUserUseCase } from '@/domain/use-cases/users'
import { InvalidCredentialsError } from '@/application/errors/errors'
import { env } from '@/infra/env'

export class AuthenticateUserController {
  constructor(private readonly authenticateUserUseCase: IAuthenticateUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const body = z
        .object({
          email: z.string().email(),
          password: z.string(),
        })
        .parse(req.body)

      const { user } = await this.authenticateUserUseCase.execute(body)
      const token = jwt.sign({ sub: user.userId }, env.JWT_SECRET, { expiresIn: '1d' })

      return res.status(200).json({ token })
    } catch (error: any) {
      if (error instanceof InvalidCredentialsError) {
        return res.status(401).json({ message: error.message })
      }
      next(error)
    }
  }
}
