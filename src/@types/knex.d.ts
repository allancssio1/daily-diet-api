// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: number
      email: string
      created_at: string
    }
    recipes: {
      id: string
      name: number
      description: string
      created_at: string
      userId: string
    }
  }
}