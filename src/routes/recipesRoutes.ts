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
      name: z.string().min(2, {message: 'name must be at least two characters long.'}),
      description: z.string().default(''),
      diet_conform: z.boolean().refine((val) => typeof val !== 'boolean', {message: 'diet_conform needs boolean type (false or true) and is required.'})
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

  app.post('/edit/:id', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const paramsId = z.object({
      id: z.string().uuid({message: "Recipe id isn't valid!"})
    })

    const {id} = paramsId.parse(request.params)

    const {sessionId} = request.cookies
    const userBySessioId = await knexDb('users')
      .where('session_id', sessionId)
      .first()

    if(!userBySessioId) return reply.status(404).send("User not found!")

    const recipe = await knexDb('recipes').where('id', id).first()

    if(!recipe) return reply.status(404).send("Recipe not found!")

    const editBodySchema = z.object({
      name: z.string().min(2, {message: 'name must be at least two characters long.'}),
      description: z.string().default(''),
      diet_conform: z.boolean().refine((val) => typeof val !== 'undefined', {message: 'diet_conform needs boolean type (false or true) and is required.'})
    })

    const {name, description, diet_conform} = editBodySchema.parse(request.body)

    await knexDb('recipes').where('id', id).update({
      name, description, diet_conform
    })

    return reply.status(201).send('Recipe updates')
  })

  //TODO: essa rota é para listar todos as refeições do usuário. o id é do usuário
  app.get('/:id', async (request, reply) => {
    const paramsId = z.object({
      id: z.string().uuid({message: "Recipe id isn't valid!"})
    })

    const {id} = paramsId.parse(request.params)
    const a = await knexDb('recipes').where('id', id).select('*')

    return reply.status(200).send(a)
  })
}