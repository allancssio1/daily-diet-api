// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
      session_id?: string
    }
    recipes: {
      id: string
      name: string
      description?: string
      created_at: string
      user_id: string
      diet_conform: boolean
    }
  }
}