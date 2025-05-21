import "reflect-metadata";
import { Container } from "inversify";
import { Main, Users } from "./controllers";
import { ConfigService } from "./services/config.service";
import { AiService } from "./services/ai.service";

const container = new Container();

container.bind(ConfigService).toSelf().inSingletonScope();
container.bind(AiService).toSelf().inSingletonScope();
container.bind(Main).toSelf().inSingletonScope();
container.bind(Users).toSelf().inSingletonScope();

container.bind(Container).toConstantValue(container);

export { container };
