import { FastifyInstance } from "fastify";
import { usersController } from "../controllers/usersController";

export async function usersRoutes (app: FastifyInstance)  {
  app.post('/create', async (request, reply) => {
    const {name, email} = request.body

    console.log(name, email);
    return reply.status(201).send('created')
  })
  app.get('/', usersController.findUsers)
}