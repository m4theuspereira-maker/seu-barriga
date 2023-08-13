import express, { json, urlencoded } from "express";
import cors from "cors";
import { routes } from "./src/routes";
import { PORT } from "./src/common/environment-consts";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

app.get("/", (req, res) => {
  return res.json("I'm working");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT} 🚀`);
});

export { app };
