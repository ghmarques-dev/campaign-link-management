import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/infra/env'

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
