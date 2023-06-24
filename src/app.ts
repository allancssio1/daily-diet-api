import fastify from "fastify";
import cookie from '@fastify/cookie'
import { usersRoutes } from "./routes/usersRoutes";
import { recipesRoutes } from "./routes/recipesRoutes";

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users'
})
app.register(recipesRoutes, {
  prefix: 'recipes'
})