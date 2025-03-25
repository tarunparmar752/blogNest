import { Hono } from "hono";

export const blogRouter = new Hono();

blogRouter.post("/api/v1/blog", (c) => {
  return c.text("Blog created");
});

blogRouter.put("/api/v1/blog", (c) => {
  return c.text("Blog updated");
});

blogRouter.get("/api/v1/blog/:id", (c) => {
  return c.text("fetched blog by id");
});

blogRouter.get("/api/v1/blog/bulk", (c) => {
  return c.text("fetched in bulk");
});
