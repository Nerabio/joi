import { injectable } from "inversify";
import { CONTINUATION_PHRASE, DEFAULT_MESSAGE, WELCOME_MESSAGE } from "../../shared/constants/constants";
import { AiService } from "./ai.service";
import { HistoryService } from "./history.service";
import { StorageService } from "./storage.service";
import {MessageStatus, Role} from "../../shared/interfaces";
import {ApiErrorException} from "../../shared/errors/api-error.exception";



@injectable()
export class FacadeService {
      constructor(
        private readonly ai: AiService,
        private readonly storage: StorageService,
        private readonly history: HistoryService,
      ) {}

    async getAnswer(question: string): Promise<string> {
        try {
          if (this.isContinuePhrase(question)) {
              return await this.getDelayedAnswer();
          }

            return question.length > 0
                ? await Promise.race([this.timeout(), this.request(question)])
                : WELCOME_MESSAGE;
        } catch (error) {
            console.log('Error in getAnswer', error);
            throw new ApiErrorException('Failed to get answer', 500);
        }
    }

    private request(message: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
          this.storage.create();
          this.history.add(Role.USER, message);
          const responseAi = await this.ai.request(message);
          this.storage.saveText(responseAi);
          this.history.add(Role.ASSISTANT, responseAi);
          resolve(responseAi);
        });
      }

      private getDelayedAnswer(): Promise<string>{
        const delayedAnswer = Object.assign(this.storage.get());
        console.log("- MORE -> ", delayedAnswer?.status);
        const isComplete = delayedAnswer?.status === MessageStatus.COMPLETE;
        const messageRes =
        isComplete
            ? delayedAnswer.answer
            : null;

            if (isComplete) {
                this.storage.clear();
              }
        return messageRes ?? DEFAULT_MESSAGE;      
      }

      private isContinuePhrase(input: string): boolean {
        return this.prepareString(input) === CONTINUATION_PHRASE;
      }
    
      private prepareString(message: string): string {
        return message.trim().toLowerCase();
      }

      private timeout(): Promise<string> {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(DEFAULT_MESSAGE);
            }, 3000);
          });
        }
}