import { knexDb } from "../dbConfig"

export const userModels = {
  create: () => {

  },
  findAllUsers: async () => {
    await knexDb('users')
  }
}