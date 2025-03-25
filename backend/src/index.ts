import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.use("/api/v1/blog/*", async (c, next) => {
  const jwt = c.req.header("authorization");
  if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
  const token = jwt.split(" ")[1];
  const response = await verify(token, c.env.JWT_SECRET);
  if (response.id) {
    c.set("userId", response.id.toString());
    await next();
  }
  return c.json({ error: "Unauthorized" }, 401);
});

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);


app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
