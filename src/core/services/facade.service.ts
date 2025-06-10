import { injectable } from 'inversify';
import { CONTINUATION_PHRASE, WELCOME_MESSAGE } from '../../shared/constants/constants';
import { HistoryService } from './history.service';
import { StorageService } from './storage.service';
import { ApiErrorException } from '../../shared/errors/api-error.exception';
import { getRandomMessage } from '../../shared/utils/get-rnd-item';
import { LogService } from './log.service';
import { RequestFactory } from '../factories/request.factory';
import { Role } from '../../shared/interfaces';

@injectable()
export class FacadeService {
  constructor(
    private readonly requestFactory: RequestFactory,
    private readonly storage: StorageService,
    private readonly history: HistoryService,
    private readonly log: LogService,
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
      this.log.error(error);
      throw new ApiErrorException('Failed to get answer', 500);
    }
  }

  private request(message: string): Promise<string> {
    this.log.info(`request user -> ${message}`);
    return new Promise(async (resolve, reject) => {
      this.storage.create();
      const responseAi = await this.requestFactory.request(message);
      this.storage.saveText(responseAi);
      this.history.add(Role.ASSISTANT, responseAi);
      this.log.info(`response Ai -> ${responseAi}`);
      resolve(responseAi);
    });
  }

  private getDelayedAnswer(): Promise<string> {
    const delayedAnswer = Object.assign(this.storage.get());
    this.log.info(delayedAnswer);
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
