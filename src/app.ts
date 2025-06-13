import 'reflect-metadata';
import { container } from './core/DI/container';
import { appRouter } from './core/decorators';
import express = require('express');

import { ConfigService } from './core/services';
require('dotenv').config();

const config = container.get(ConfigService);
const port = parseInt(config.getKey('port') || '8080', 10);

const app = express();
app.use(express.json());
//app.use(requestLogger);
app.use(appRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
