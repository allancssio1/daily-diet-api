import { FastifyReply, FastifyRequest } from "fastify";
import { userModels } from "../models/usersModels";

export const usersController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const {name, email} = request.body
    await userModels.create(name, email)
    return reply.status(200).send('criou')
  },
  findUsers: async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('entou aqui')
    const users = await userModels.findAllUsers()
    console.log(users)
    return reply.status(200).send({users})
  }
}