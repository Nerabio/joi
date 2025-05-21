import { Request, Response } from "express";
import { Post, Get, controller } from "../decorators/routes.decorator";
import { injectable } from "inversify";
import { AiService } from "../services/ai.service";

@controller("/")
@injectable()
export class Main {
  private static answer = {
    response: {
      text: "Здравствуйте! Это мы, хороводоведы.",
      tts: "Здравствуйте! Это мы, хоров+одо в+еды.",
      end_session: false,
    },
    version: "1.0",
  };

  constructor(private readonly aiService: AiService) {}

  @Post("/main")
  async getUsers(req: Request, res: Response): Promise<void> {
    const { original_utterance } = req.body.request;
    let response;
    if (original_utterance.length > 0) {
      response = await this.aiService.request(original_utterance);
    } else {
      response = "Я слушаю";
    }
    res.json({
      response: {
        text: response,
        tts: response,
        end_session: false,
      },
      version: "1.0",
    });
  }

  @Get("/main")
  getIndex(req: Request, res: Response): void {
    res.json(Main.answer);
  }
}
