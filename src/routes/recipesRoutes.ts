import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'
import { knexDb } from "../dbConfig";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkUserExistsBySessioId } from "../middlewares/checkUserExistsBySessioId";
import { Recipes } from "../types/recipes";

export async function recipesRoutes (app: FastifyInstance)  {
  app.post('/create', {
    preHandler: [checkSessionIdExists, checkUserExistsBySessioId]
  }, async (request, reply) => {
    const createRecipesBodySchema: any = z.object({
      name: z.string().min(2, {message: 'name must be at least two characters long.'}),
      description: z.string().default(''),
      created_at: z.coerce.date(),
      diet_conform: z.boolean().refine((val) => typeof val === 'boolean', {message: 'diet_conform needs boolean type (false or true) and is required.'})
    })

    const {
      name, description, diet_conform, created_at
    } = createRecipesBodySchema.parse(request.body)

    const querySchema = z.object({
      userId: z.string().uuid({message: "Recipe id isn't valid!"})
    })
    const {userId} = querySchema.parse(request.query)

    await knexDb('recipes').insert({
      id: randomUUID(),
      name,
      description,
      diet_conform,
      created_at: new Date(created_at).toISOString(),
      user_id: userId
    })
    
    return reply.status(201).send(userId)
  })

  app.get('/', {
    preHandler: [checkSessionIdExists, checkUserExistsBySessioId]
  }, async (request, reply) => {
    const {diet,userId} = request.query

    let recipes: Recipes[] = await knexDb('recipes').where('user_id', userId).select('*')
    let countsDietRigth = null
    let countsDietWrong = null
    let total = null

    if(recipes[0].user_id !== userId) return reply.status(401).send('User unauthorized')

    if(diet === 'true') {
      countsDietRigth = await knexDb('recipes').where({
          user_id: userId,
        }).count()
    }
    if(diet==='false') {
       countsDietWrong = await knexDb('recipes').where({
        user_id: userId,
        diet_conform: false
      }).count()
    }
    if(total){
      total = await knexDb('recipes').where('user_id', userId).count()
    }

    return reply.status(200).send({
      countsDietRigth: countsDietRigth && countsDietRigth[0]["count(*)"],
      countsDietWrong: countsDietWrong && countsDietWrong[0]["count(*)"],
      total: total && total[0]["count(*)"],
      recipes
    })
  })

  app.get('/:id', {
    preHandler: [checkSessionIdExists, checkUserExistsBySessioId]
  }, async (request, reply) => {
    const paramsId = z.object({
      id: z.string().uuid({message: "Recipe id isn't valid!"})
    })
    const {id} = paramsId.parse(request.params)

    const querySchema = z.object({
      userId: z.string().uuid({message: "Recipe id isn't valid!"})
    })
    const {userId} = querySchema.parse(request.query)

    const recipe = await knexDb('recipes').where('id', id).first()

    if(!recipe) return reply.status(404).send("User not found!")
    
    if(recipe.user_id !== userId) return reply.status(401).send('User unauthorized')

    return reply.status(200).send(recipe)
  })

  app.put('/edit/:id', {
    preHandler: [checkSessionIdExists, checkUserExistsBySessioId]
  }, async (request, reply) => {
    const paramsId = z.object({
      id: z.string().uuid({message: "Recipe id isn't valid!"})
    })

    const {id} = paramsId.parse(request.params)
    const {userId} = request.query

    const recipe = await knexDb('recipes').where('id', id).first()

    if(!recipe) return reply.status(404).send("Recipe not found!")

    if(recipe.user_id !== userId) return reply.status(401).send('User unauthorized')

    const editBodySchema = z.object({
      name: z.string().min(2, {message: 'name must be at least two characters long.'}),
      description: z.string().default(''),
      created_at: z.coerce.date(),
      diet_conform: z.boolean().refine((val) => typeof val === 'boolean', {message: 'diet_conform needs boolean type (false or true) and is required.'})
    })

    const {name, description, diet_conform, created_at} = editBodySchema.parse(request.body)

    await knexDb('recipes').where('id', id).update({
      name, description, diet_conform, 
      created_at: new Date(created_at).toISOString(),
    })

    return reply.status(201).send('Recipe updates')
  })

  app.delete('/:id', {
    preHandler: [checkSessionIdExists, checkUserExistsBySessioId]
  }, async (request, reply) => {
    const paramsId = z.object({
      id: z.string().uuid({message: "Recipe id isn't valid!"})
    })

    const {id} = paramsId.parse(request.params)
    const {userId} = request.query

    const recipeFound = await knexDb('recipes').where('id', id).first()

    if(!recipeFound) return reply.status(404).send('Recipe not found')

    if(recipeFound.user_id !== userId) return reply.status(401).send('User unauthorized')

    await knexDb('recipes').where('id', id).delete()
    
    return reply.status(200).send('Recipe removed on database')
  })
}