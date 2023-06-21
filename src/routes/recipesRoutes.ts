import { FastifyInstance } from "fastify";

export async function recipesRoutes (app: FastifyInstance)  {
  app.get('/', async (request, reply) => {
    console.log('recipes')
    return reply.status(200).send('buscar recipes')
  })
}