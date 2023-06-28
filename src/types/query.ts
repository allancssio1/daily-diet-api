import { FastifyRequest } from "fastify"

export type MyRequest = FastifyRequest<{
    Querystring: { 
    userId: string
    diet: string
    dietTotal: string
  } 
}>