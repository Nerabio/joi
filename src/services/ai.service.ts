import { injectable } from "inversify";
import { ConfigService } from "./config.service";
import OpenAI from "openai";

@injectable()
export class AiService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      baseURL: this.configService.getKey("baseUrl"),
      apiKey: this.configService.getKey("apiKey"),
    });
  }

  async request(ask: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: this.configService.getKey("model"),
      max_completion_tokens: 300,
      messages: [
        // {
        //   role: "system",
        //   content: "Отвечай только plain-текстом, без тегов и комментариев.",
        // },
        {
          role: "user",
          content: ask,
        },
      ],
    });

    return completion.choices[0].message.content;
  }
}
