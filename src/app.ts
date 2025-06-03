import 'reflect-metadata';
import { container } from './core/DI/container';
import { appRouter } from './core/decorators';
import express = require('express');

import { ConfigService } from './core/services';
import { requestLogger } from './core/middlewares/logger.middleware';
require('dotenv').config();

const config = container.get(ConfigService);
const port = 8080;

const app = express();
app.use(express.json());
//app.use(requestLogger);
app.use(appRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
