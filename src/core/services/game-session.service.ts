import { injectable } from 'inversify';

import { AiService } from './ai.service';
import { GameStateService } from './game-state.service';
import { ProviderService } from './provider.service';
import { LogService } from './log.service';
import Handlebars from 'handlebars';

@injectable()
export class GameSessionService {
  constructor(
    private readonly aiService: AiService,
    private readonly providerService: ProviderService,
    private readonly stateService: GameStateService,
    private readonly log: LogService,
  ) {}

  // async handleInput(userInput: string): Promise<string> {
  //   return Promise.resolve(userInput);
  // }

  async handleInput(userInput: string): Promise<string> {
    const systemPrompt = this.buildPrompt(userInput, this.providerService.getSystemPromtTemplate());
    this.log.info('[GameSessionService] handleInput buildPrompt ->>', systemPrompt);
    this.providerService.updateSystemRole(systemPrompt);
    const aiResponse = await this.aiService.request(userInput);
    this.log.info('[GameSessionService] handleInput aiResponse ->>', aiResponse);
    return this.updateAndResponse(aiResponse);
  }

  private buildPrompt(input: string, systemRoleTemplate: string): string {
    this.log.info('[GameSessionService] buildPrompt systemRoleTemplate ->>', systemRoleTemplate);
    Handlebars.registerHelper('raw-json', (context) => {
      return new Handlebars.SafeString(JSON.stringify(context));
    });
    const template = Handlebars.compile(systemRoleTemplate);
    const state = this.stateService.getState();
    return template({ state, input });
  }

  private updateAndResponse(aiResponse: string): string {
    try {
      const data = JSON.parse(aiResponse);
      this.log.info('[GameSessionService] processResponse parse aiResponse ->>', data);

      if (data.update_state) {
        this.log.info('[GameSessionService] processResponse updateState ->>', data.update_state);
        this.stateService.updateState(data.update_state);
      }
      return data.response;
    } catch (e) {
      this.log.info('[GameSessionService] processResponse error ->>', e);
      return 'Сбой искусственного интеллекта корабля... Критическая ошибка.';
    }
  }
}
