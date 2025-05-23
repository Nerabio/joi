import {Container, injectable} from "inversify";
import {AiService, ConfigService, FacadeService, HistoryService, StorageService} from "../../services";

@injectable()
export class ServicesModule {
    public static register(container: Container): void {
        container.bind(ConfigService).toSelf().inSingletonScope();
        container.bind(FacadeService).toSelf().inSingletonScope();
        container.bind(AiService).toSelf().inSingletonScope();
        container.bind(HistoryService).toSelf().inSingletonScope();
        container.bind(StorageService).toSelf().inSingletonScope();
    }
}