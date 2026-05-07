import { Parameter } from './parameter'

export type Link = {
  linkId: string
  name: string
  baseUrl: string
  redirectUrl: string | null
  parameters: Parameter[]
  projectId: string
  createdAt: Date
  updatedAt: Date
}
