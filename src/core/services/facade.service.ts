import { injectable } from 'inversify';
import { CONTINUATION_PHRASE, WELCOME_MESSAGE } from '../../shared/constants/constants';
import { AiService } from './ai.service';
import { HistoryService } from './history.service';
import { StorageService } from './storage.service';
import { MessageStatus, Role } from '../../shared/interfaces';
import { ApiErrorException } from '../../shared/errors/api-error.exception';
import { getRandomMessage } from '../../shared/utils/get-rnd-item';

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
      const responseAi = await this.ai.request(message);
      this.storage.saveText(responseAi);
      this.history.add(Role.ASSISTANT, responseAi);
      resolve(responseAi);
    });
  }

  private getDelayedAnswer(): Promise<string> {
    const delayedAnswer = Object.assign(this.storage.get());
    console.log('- MORE -> ', delayedAnswer?.status);
    const isComplete = this.storage.isComplete();
    if (!isComplete) {
      return Promise.resolve(getRandomMessage());
    }
    this.storage.clear();
    return delayedAnswer.answer;
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
        resolve(getRandomMessage());
      }, 4100);
    });
  }
}
