import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knexDb } from "../dbConfig";
import { checkSessionIdExists } from "../middlewares/checkSessionIdExists";

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

    const session_id = await knexDb('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId
    }).returning('session_id')

    return reply.status(201).send(session_id)
  })

  app.post('/login', async (request, reply) => {
    const loginUserSchema = z.object({
      email: z.string()
    })

    const { email } = loginUserSchema.parse(request.body)

    const user = await knexDb('users').where('email', email).first()

    if(!user) return reply.status(404).send("There aren't user registred")

    const {sessionId} = request.cookies

    if(sessionId && sessionId === user.session_id){
      return reply.status(200).send("allowed access")
    }
    const newSessionId = randomUUID()
    reply.cookie('sessionId', newSessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    })

    await knexDb("users").where('id', user.id).update({
      session_id: newSessionId
    })

    return reply.status(200).send("allowed access")
  })

  //TODO: esta rota é so para retornar os usuários do banco de dados. apenas para teste
  app.get('/all', async (request, reply) => {
    const users = await knexDb('users').select('*')
    return reply.status(200).send({users})
  })
}