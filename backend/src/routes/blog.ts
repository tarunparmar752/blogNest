import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("*", async (c, next) => {
  const jwt = c.req.header("authorization") || "";
  const token = jwt?.split(" ")[1];

  const response = await verify(token, c.env.JWT_SECRET);
  if (response.id) {
    c.set("userId", response.id.toString());
    await next();
  } else {
    return c.json({ Error: "Unauthorized user" }, 401);
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get("userId");
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });
  return c.json({ id: blog.id }, 201);
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({ id: blog.id });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany();
    return c.json({ blogs });
  } catch (e) {
    c.json({ error: "Error while fetching the blogs" }, 400);
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: body.id,
      },
    });
    return c.json({ blog });
  } catch (e) {
    c.json({ error: "Error while fetching the blog post" }, 400);
  }
});
