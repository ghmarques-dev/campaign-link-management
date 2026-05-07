import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ 
      message: 'Validation error', 
      issues: error.format(),
      stack: error.stack,
    })
  }
  
  return res.status(500).json({ message: 'Internal server error', data: error.message })
}
