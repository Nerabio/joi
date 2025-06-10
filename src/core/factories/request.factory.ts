import { inject, injectable } from 'inversify';
import { SystemType } from '../../shared/interfaces';
import { ProviderService, GameSessionService, AiService, LogService } from '../services';

@injectable()
export class RequestFactory {
  constructor(
    @inject(ProviderService) private readonly providerService: ProviderService,
    @inject(GameSessionService) private readonly gameService: GameSessionService,
    @inject(AiService) private readonly aiService: AiService,
    private readonly log: LogService,
  ) {}

  request(ask: string): Promise<string> {
    const systemRole = this.providerService.getSystemRole();
    this.log.info('requestFactory is game ->> ', systemRole?.type);
    return systemRole?.type === SystemType.GAME
      ? this.gameService.handleInput(ask)
      : this.aiService.request(ask);
  }
}
