import { Hono } from "hono";

export const blogRouter = new Hono();

blogRouter.post("/", (c) => {
  return c.text("Blog created");
});

blogRouter.put("/", (c) => {
  return c.text("Blog updated");
});

blogRouter.get("/:id", (c) => {
  return c.text("fetched blog by id");
});

blogRouter.get("/bulk", (c) => {
  return c.text("fetched in bulk");
});
