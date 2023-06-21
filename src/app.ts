import fastify from "fastify";
import { usersRoutes } from "./routes/usersRoutes";
import { recipesRoutes } from "./routes/recipesRoutes";

export const app = fastify()

app.register(usersRoutes, {
  prefix: 'user'
})
app.register(recipesRoutes, {
  prefix: 'recipe'
})