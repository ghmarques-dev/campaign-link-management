import { UseCaseError } from '../use-case-error'

export class ParameterNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Parameter not found')
  }
}
