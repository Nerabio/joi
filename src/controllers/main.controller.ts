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
import { HistoryService } from "../services/history.service";

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
    private readonly storageService: StorageService,
    private readonly history: HistoryService
  ) {}

  @Post("/main")
  async getUsers(req: Request, res: Response): Promise<void> {
    const { original_utterance } = req.body.request;

    if (this.isContinuePhrase(original_utterance)) {
      const lastMessage = Object.assign(this.storageService.get());
      console.log("- MORE -> ", lastMessage?.status);
      const isComplete = lastMessage?.status === "complete";

      const messageRes =
      isComplete
          ? lastMessage.answer
          : null;

      if (isComplete) {
        this.storageService.clear();
      }

      console.log("history-m -> ", this.history.getLastHistory(3));
      this.sendResponse(messageRes ?? DEFAULT_MESSAGE, res);
      return;
    }

    const response =
      original_utterance.length > 0
        ? await Promise.race([this.timeout(), this.request(original_utterance)])
        : WELCOME_MESSAGE;

    console.log("history -> ", this.history.getLastHistory(3));
    this.sendResponse(response, res);
  }

  @Get("/main")
  getIndex(req: Request, res: Response): void {
    res.json(Main.answer);
  }

  sendResponse(message: string, res: Response): void {
    res.json({
      response: {
        text: message,
        tts: message,
        end_session: false,
      },
      version: "1.0",
    });
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
      this.storageService.saveText(responseAi);
      this.history.add("assistant", responseAi);
      resolve(responseAi);
    });
  }

  private isContinuePhrase(input: string): boolean {
    return this.prepareString(input) === CONTINUATION_PHRASE
  }

  private prepareString(message: string): string {
    return message.trim().toLowerCase();
  }
}
