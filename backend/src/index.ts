import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

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

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/user/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: { email: body.email, password: body.password },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.text(jwt, 201);
  } catch (error) {
    return c.json({ message: "user creaton failed" }, 403);
  }
});

app.post("/api/v1/user/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: { email: body.email, password: body.password },
  });
  if (!user) {
    return c.json({ message: "user not found" }, 404);
  }
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.text("jwt:" + jwt);
});

app.post("/api/v1/blog", (c) => {
  return c.text("Blog created" + c.get("userId"));
});

app.put("/api/v1/blog", (c) => {
  return c.text("Blog updated");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("fetched blog by id");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("fetched in bulk");
});

export default app;
