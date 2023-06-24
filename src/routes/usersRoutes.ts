import { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'
import { randomUUID } from "node:crypto";
import { knexDb } from "../dbConfig";

export async function usersRoutes (app: FastifyInstance)  {
  app.post('/create', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string()
    })

    const {name, email} = createUsersBodySchema.parse(request.body)
    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      })
    }

    await knexDb('users').insert({
      id: randomUUID(),
      name,
      email,
      
    })

    return reply.status(201).send('created')
  })
}