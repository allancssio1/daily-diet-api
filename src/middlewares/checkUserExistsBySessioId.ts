import { FastifyReply, FastifyRequest } from 'fastify'
import { knexDb } from '../dbConfig'

export const checkUserExistsBySessioId = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const {sessionId} = request.cookies
    const userBySessioId = await knexDb('users')
      .where('session_id', sessionId)
      .first()

    if(!userBySessioId) return reply.status(404).send("User not found!")

   request.query = {
    userId: userBySessioId.id
   }
}