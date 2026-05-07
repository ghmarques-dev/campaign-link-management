import { UseCaseError } from '../use-case-error'

export class LinkNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Link not found')
  }
}
