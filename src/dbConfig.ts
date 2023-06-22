import { knex, Knex } from 'knex'

export const config = {
  client: 'sqlite',
  connection: {
    filename: './database/app.db'
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}


export const knexDb = knex(config)