import { Request, Response } from "express";
import { Post, Get, controller } from "../decorators/routes.decorator";
import { injectable } from "inversify";
import { AiService } from "../services/ai.service";
import {
  CONTINUATION_PHRASE,
  DEFAULT_MESSAGE,
  WELCOME_MESSAGE,
} from "../constants";
import { StorageService } from "../services/storage.service";

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

  constructor(
    private readonly aiService: AiService,
    private readonly storageService: StorageService
  ) {}

  @Post("/main")
  async getUsers(req: Request, res: Response): Promise<void> {
    const { original_utterance } = req.body.request;

    if (this.prepareString(original_utterance) === CONTINUATION_PHRASE) {
      const lastMessage = Object.assign(this.storageService.get());
      if (lastMessage?.status === "complete") {
        this.storageService.clear();
        res.json({
          response: {
            text: lastMessage.answer,
            tts: lastMessage.answer,
            end_session: false,
          },
          version: "1.0",
        });
        return;
      }
    }

    const response =
      original_utterance.length > 0
        ? await Promise.race([this.timeout(), this.request(original_utterance)])
        : WELCOME_MESSAGE;

    console.log("input -> ", original_utterance);
    console.log("output -> ", response);

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

  timeout(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(DEFAULT_MESSAGE);
      }, 3000);
    });
  }

  request(message: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.storageService.create();
      const responseAi = await this.aiService.request(message);
      resolve(this.storageService.saveText(responseAi).answer);
    });
  }

  prepareString(message: string): string {
    return message.trim().toLowerCase();
  }
}
