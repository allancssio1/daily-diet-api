import { FastifyReply } from 'fastify'
import { knexDb } from '../dbConfig'
import { MyRequest } from '../types/query'

export const checkUserExistsBySessioId = async (
  request: MyRequest,
  reply: FastifyReply,
) => {
    const {sessionId} = request.cookies
    const userBySessioId = await knexDb('users')
      .where('session_id', sessionId)
      .first()

    if(!userBySessioId) return reply.status(404).send("User not found!")

   request.query.userId = userBySessioId.id
}