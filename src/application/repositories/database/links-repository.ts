import { Link } from '@/domain/entities'

export type LinksRepository = {
  create(input: LinksRepository.Create.Input): LinksRepository.Create.Output
  findManyByProjectId(input: LinksRepository.FindManyByProjectId.Input): LinksRepository.FindManyByProjectId.Output
  findById(input: LinksRepository.FindById.Input): LinksRepository.FindById.Output
  update(input: LinksRepository.Update.Input): LinksRepository.Update.Output
  delete(input: LinksRepository.Delete.Input): LinksRepository.Delete.Output
  addParameter(input: LinksRepository.AddParameter.Input): LinksRepository.AddParameter.Output
  removeParameter(input: LinksRepository.RemoveParameter.Input): LinksRepository.RemoveParameter.Output
}

export namespace LinksRepository {
  export namespace Create {
    export type Input = {
      name: string
      baseUrl: string
      redirectUrl?: string | null
      projectId: string
    }
    export type Output = Promise<Link>
  }

  export namespace FindManyByProjectId {
    export type Input = { projectId: string; page: number; pageSize: number; name?: string }
    export type Output = Promise<{ links: Link[]; total: number }>
  }

  export namespace FindById {
    export type Input = { linkId: string }
    export type Output = Promise<Link | null>
  }

  export namespace Update {
    export type Input = {
      linkId: string
      name?: string
      baseUrl?: string
      redirectUrl?: string | null
    }
    export type Output = Promise<Link>
  }

  export namespace Delete {
    export type Input = { linkId: string }
    export type Output = Promise<void>
  }

  export namespace AddParameter {
    export type Input = { linkId: string; parameterId: string; key: string; value: string }
    export type Output = Promise<void>
  }

  export namespace RemoveParameter {
    export type Input = { linkId: string; parameterId: string }
    export type Output = Promise<void>
  }
}
