import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'
import { knexDb } from "../dbConfig";
import { z } from "zod";
import { randomUUID } from "node:crypto";

export async function recipesRoutes (app: FastifyInstance)  {
  app.post('/create', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const createRecipesBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet_conform: z.boolean()
    })

    const {
      name, description, diet_conform
    } = createRecipesBodySchema.parse(request.body)

    const {sessionId} = request.cookies
    const userBySessioId = await knexDb('users')
      .where('session_id', sessionId)
      .first()

    if(!userBySessioId) return reply.status(401).send("não é o usuário")

    await knexDb('recipes').insert({
      id: randomUUID(),
      name,
      description,
      diet_conform,
      user_id: userBySessioId.id
    })
    
    return reply.status(201).send(userBySessioId)
  })

  //TODO: essa rota é para listar todos as refeições do usuário. o id é do usuário
  app.get('/:id', async (request, reply) => {
    const idParams = z.object({
      id: z.string(),
    })

    const { id } = idParams.parse(request.params)
    
    const a = await knexDb('recipes').where('user_id', id).select('*')

    return reply.status(200).send(a)
  })
}