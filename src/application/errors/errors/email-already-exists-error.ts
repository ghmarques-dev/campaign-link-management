import { UseCaseError } from '../use-case-error'

export class EmailAlreadyExistError extends Error implements UseCaseError {
  constructor() {
    super('Email already exists')
  }
}
