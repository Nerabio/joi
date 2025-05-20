import * as express from "express";
import { appGetRouter } from "./decorators";
import "./controllers";

const app = express();
app.use(appGetRouter);
app.listen(8080, () => {
  console.log("Server is running on port 3000");
});
