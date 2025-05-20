import * as express from "express";
import { appRouter } from "./decorators";
import "./controllers";

const app = express();
app.use(appRouter);
app.listen(8080, () => {
  console.log("Server is running on port 3000");
});
