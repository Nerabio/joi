import { Container, injectable } from 'inversify';
import {
  AiService,
  ConfigService,
  FacadeService,
  HistoryService,
  StorageService,
} from '../../services';
import { OpenAIFactory } from '../../factories/openai.factory';

@injectable()
export class ServicesModule {
  public static register(container: Container): void {
    const services = [ConfigService, FacadeService, OpenAIFactory, AiService, HistoryService, StorageService];
    services.forEach(service => {
      container.bind(service).toSelf().inSingletonScope();
    });
  }
}
