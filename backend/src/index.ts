import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/user/singup", (c) => {
  return c.text("User created");
});

app.post("/api/v1/user/signin", (c) => {
  return c.text("User Logged In");
});

app.post("/api/v1/blog", (c) => {
  return c.text("Blog created");
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
