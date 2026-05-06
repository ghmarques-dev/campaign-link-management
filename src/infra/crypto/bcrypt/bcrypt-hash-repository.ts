import bcrypt from 'bcryptjs'
import { HashRepository } from '@/application/repositories/crypto'

export class BcryptHashRepository implements HashRepository {
  async create(input: HashRepository.Create.Input): HashRepository.Create.Output {
    return bcrypt.hash(input.string, input.salt)
  }

  async compare(input: HashRepository.Compare.Input): HashRepository.Compare.Output {
    return bcrypt.compare(input.string, input.hash)
  }
}
