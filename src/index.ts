import "reflect-metadata";
import { container } from "./container";
import { appRouter } from "./decorators";
import * as express from "express";

import { ConfigService } from "./services/config.service";
require("dotenv").config();

const config = container.get(ConfigService);
const port = 8080;

const app = express();
app.use(express.json());
app.use(appRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
