import { FastifyReply, FastifyRequest } from "fastify";

export const recipesController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send('criou')
  }
}