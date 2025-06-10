import { Container, injectable } from 'inversify';
import {
  AiService,
  ConfigService,
  FacadeService,
  GameSessionService,
  GameStateService,
  HistoryService,
  LogService,
  ProviderService,
  StorageService,
} from '../../services';
import { OpenAIFactory } from '../../factories/openai.factory';
import { RequestFactory } from '../../factories/request.factory';

@injectable()
export class ServicesModule {
  public static register(container: Container): void {
    const services = [
      LogService,
      ConfigService,
      FacadeService,
      OpenAIFactory,
      AiService,
      HistoryService,
      StorageService,
      ProviderService,
      RequestFactory,
      GameStateService,
      GameSessionService,
    ];
    services.forEach((service) => {
      container.bind(service).toSelf().inSingletonScope();
    });
  }
}
