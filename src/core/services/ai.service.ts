import { injectable } from 'inversify';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { MessageHistory, Role, SettingsAi } from '../../shared/interfaces';
import { ConfigService } from './config.service';
import { HistoryService } from './history.service';
import { OpenAIFactory } from '../factories/openai.factory';

@injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly settingsAi: SettingsAi;

  constructor(
    private readonly configService: ConfigService,
    private readonly history: HistoryService,
    private readonly openaiFactory: OpenAIFactory,
  ) {
    this.settingsAi = this.getSettings(this.configService);
    this.openai = this.openaiFactory.create(this.settingsAi);
  }

  async request(ask: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: this.settingsAi.model,
      max_completion_tokens: this.settingsAi.maxCompletionTokens ?? 300,
      messages: this.makeMessage(ask, this.settingsAi, this.history.getLastHistory(25)),
    });

    return completion.choices[0].message.content;
  }

  private makeMessage(
    ask: string,
    settings: SettingsAi,
    history: MessageHistory[],
  ): ChatCompletionMessageParam[] {
    const messageParam = [
      {
        role: Role.SYSTEM,
        content: settings.systemRole,
      },
    ] as ChatCompletionMessageParam[];
    history.forEach((item) => messageParam.push(item));
    messageParam.push({
      role: Role.USER,
      content: ask,
    });
    this.history.add(Role.USER, ask);
    console.log(this.history);
    return messageParam;
  }

  private getSettings(configService: ConfigService): SettingsAi {
    return {
      baseURL: configService.getKey('baseUrl'),
      apiKey: configService.getKey('apiKey'),
      model: configService.getKey('model'),
      systemRole: configService.getKey('systemRole'),
      maxCompletionTokens: +configService.getKey('maxCompletionTokens'),
    };
  }
}
