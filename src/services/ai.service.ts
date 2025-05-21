import { injectable } from "inversify";
import { ConfigService } from "./config.service";
import OpenAI from "openai";

@injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async request(ask: string): Promise<string> {
    const openai = new OpenAI({
      baseURL: this.configService.getKey("baseUrl"),
      apiKey: this.configService.getKey("apiKey"),
    });
    const completion = await openai.chat.completions.create({
      model: this.configService.getKey("model"),

      messages: [
        {
          role: "system",
          content: "Отвечай только plain-текстом, без тегов и комментариев.",
        },
        {
          role: "user",
          content: ask,
        },
      ],
    });

    return completion.choices[0].message.content;
  }
}
