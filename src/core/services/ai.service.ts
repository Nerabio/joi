import { injectable } from 'inversify';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { MessageHistory, ModelsSetting, Provider, Role, SystemRole } from '../../shared/interfaces';
import { HistoryService } from './history.service';
import { OpenAIFactory } from '../factories/openai.factory';
import { IAiService } from '../../shared/interfaces/iai-service.interface';
import { ProviderService } from './provider.service';
import { LogService } from './log.service';

@injectable()
export class AiService implements IAiService {
  private readonly openai: OpenAI;
  private readonly currentProvider: Provider;
  private readonly systemRole: SystemRole;
  private readonly currentModel: ModelsSetting;

  constructor(
    private readonly history: HistoryService,
    private readonly openaiFactory: OpenAIFactory,
    private readonly providerService: ProviderService,
    private readonly log: LogService,
  ) {
    this.currentProvider = this.providerService.getProvider();
    this.log.info('[AiService] currentProvider ->', this.currentProvider);
    this.systemRole = this.providerService.getSystemRole();
    this.log.info('[AiService] systemRole ->', this.systemRole);
    this.currentModel = this.providerService.getModelSetting();
    this.openai = this.openaiFactory.create(this.currentProvider);
  }

  async request(ask: string): Promise<string> {
    //Frequency_penalty:  Если модель повторяет фразы («ты такой большой» → «ты такой огромный»), повысь до 0.3–0.5
    //Top_p (Nucleus sampling):Лучше держать 0.8–0.95 — это отсекает абсурдные варианты, но сохраняет креативность.
    //presence_penalty=0.1   # Поощряет новизну в ответах

    const {
      model,
      temperature,
      max_completion_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
    } = this.currentModel;

    const chatCompletionMessage = this.makeMessage(
      ask,
      this.currentModel,
      this.systemRole,
      this.history.getLastHistory(15),
    );

    console.log('HISTORY MESSAGE --->>', chatCompletionMessage);

    const completion = await this.openai.chat.completions.create({
      model: model,
      max_completion_tokens: max_completion_tokens,
      messages: chatCompletionMessage,
      top_p: top_p,
      temperature: temperature,
      frequency_penalty: frequency_penalty,
      presence_penalty: presence_penalty,
    });

    return completion.choices[0].message.content;
  }

  makeMessage(
    ask: string,
    settings: ModelsSetting,
    systemRole: SystemRole,
    history: MessageHistory[],
  ): ChatCompletionMessageParam[] {
    const messageParam = [
      {
        role: Role.SYSTEM,
        content: systemRole.role,
      },
    ] as ChatCompletionMessageParam[];
    history.forEach((item) => messageParam.push(item));
    messageParam.push({
      role: Role.USER,
      content: ask,
    });
    this.history.add(Role.USER, ask);
    return messageParam;
  }
}
