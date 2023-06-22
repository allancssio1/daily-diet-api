import { FastifyInstance } from "fastify";
import { recipesController } from "../controllers/recipesController";

export async function recipesRoutes (app: FastifyInstance)  {
  app.get('/', recipesController.create)
}