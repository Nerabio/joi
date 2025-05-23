import { injectable } from "inversify";
import { ConfigService } from "./config.service";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { SettingsAi } from "../interfaces/settings-ai.interface";
import { HistoryService } from "./history.service";
import { MessageHistory } from "../interfaces/message-history.interface";

@injectable()
export class AiService {
  private openai: OpenAI;
  private settingsAi: SettingsAi;
  constructor(
    private readonly configService: ConfigService,
    private readonly history: HistoryService
  ) {
    this.settingsAi = this.getSettings(this.configService);
    this.openai = new OpenAI({
      baseURL: this.settingsAi.baseURL,
      apiKey: this.settingsAi.apiKey,
    });
  }

  getSettings(configService: ConfigService): SettingsAi {
    return {
      baseURL: configService.getKey("baseUrl"),
      apiKey: configService.getKey("apiKey"),
      model: configService.getKey("model"),
      systemRole: configService.getKey("systemRole"),
      maxCompletionTokens: +configService.getKey("maxCompletionTokens"),
    };
  }

  async request(ask: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: this.settingsAi.model,
      max_completion_tokens: this.settingsAi.maxCompletionTokens ?? 300,
      messages: this.makeMessage(
        ask,
        this.settingsAi,
        this.history.getHistory()
      ),
    });

    return completion.choices[0].message.content;
  }

  makeMessage(
    ask: string,
    settings: SettingsAi,
    history: MessageHistory[]
  ): ChatCompletionMessageParam[] {
    const messageParam = [
      {
        role: "system",
        content: settings.systemRole,
      },
    ] as ChatCompletionMessageParam[];

    history.map((item) => messageParam.push(item));
    messageParam.push({
      role: "user",
      content: ask,
    });

    return messageParam;
  }
}
