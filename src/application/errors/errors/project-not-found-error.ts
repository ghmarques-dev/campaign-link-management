import { UseCaseError } from '../use-case-error'

export class ProjectNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Project not found')
  }
}
