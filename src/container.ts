import "reflect-metadata";
import { Container } from "inversify";
import { Main, Users } from "./controllers";
import { AiService, ConfigService, FacadeService, HistoryService, StorageService } from "./services";


const container = new Container();

container.bind(ConfigService).toSelf().inSingletonScope();
container.bind(FacadeService).toSelf().inSingletonScope();
container.bind(AiService).toSelf().inSingletonScope();
container.bind(StorageService).toSelf().inSingletonScope();
container.bind(HistoryService).toSelf().inSingletonScope();

container.bind(Main).toSelf().inSingletonScope();
container.bind(Users).toSelf().inSingletonScope();

container.bind(Container).toConstantValue(container);

export { container };
