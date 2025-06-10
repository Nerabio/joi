import { injectable } from 'inversify';

import { SystemRole } from '../../shared/interfaces';
import Handlebars from 'handlebars';
import { AiService } from './ai.service';
import { GameStateService } from './game-state.service';
import { ProviderService } from './provider.service';
import { LogService } from './log.service';

@injectable()
export class GameSessionService {
  private readonly systemRole: SystemRole;

  constructor(
    private readonly aiService: AiService,
    private readonly providerService: ProviderService,
    private readonly stateService: GameStateService,
    private readonly log: LogService,
  ) {
    this.systemRole = this.providerService.getSystemRole();
  }

  // async handleInput(userInput: string): Promise<string> {
  //   return Promise.resolve(userInput);
  // }

  async handleInput(userInput: string): Promise<string> {
    const systemPrompt = this.buildPrompt(userInput, this.systemRole);
    this.providerService.updateSystemRole(systemPrompt);
    const aiResponse = await this.aiService.request(userInput);
    return this.processResponse(aiResponse);
  }

  private buildPrompt(input: string, systemRole: SystemRole): string {
    const source = systemRole.role;
    const template = Handlebars.compile(source);
    const state = this.stateService.getState();
    return template({ state, input });
  }

  private processResponse(aiResponse: string): string {
    try {
      const data = JSON.parse(aiResponse);
      this.log.info('processResponse input->>', data);
      if (data.update_state) {
        this.stateService.updateState(data.update_state);
      }
      return data.response;
    } catch (e) {
      return 'Сбой искусственного интеллекта корабля... Критическая ошибка.';
    }
  }
}
