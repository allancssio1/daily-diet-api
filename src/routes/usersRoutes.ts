import { FastifyInstance } from "fastify";

export async function usersRoutes (app: FastifyInstance)  {
  app.get('/', async (request, reply) => {
    console.log('eu')
    return reply.status(200).send('eu aqui')
  })
}