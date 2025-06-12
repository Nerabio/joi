import { injectable } from 'inversify';
import { HistoryService } from './history.service';
import { StorageService } from './storage.service';
import { ApiErrorException } from '../../shared/errors/api-error.exception';
import { getRandomMessage } from '../../shared/utils/get-rnd-item';
import { LogService } from './log.service';
import { Role, SystemRole, SystemType } from '../../shared/interfaces';
import { AiService } from './ai.service';
import { GameSessionService } from './game-session.service';
import { ProviderService } from './provider.service';
import { ConfigService } from './config.service';

@injectable()
export class FacadeService {
  private currentRole: SystemRole;
  private requestTimeoutMs = +this.configService.getKey('requestTimeoutMs');
  constructor(
    private readonly storage: StorageService,
    private readonly history: HistoryService,
    private readonly aiService: AiService,
    private readonly gameService: GameSessionService,
    private readonly provider: ProviderService,
    private readonly configService: ConfigService,
    private readonly log: LogService,
  ) {
    this.currentRole = this.provider.getSystemRole();
  }

  async getAnswer(question: string): Promise<string> {
    try {
      if (this.isContinuePhrase(question)) {
        return await this.getDelayedAnswer();
      }

      return question.length > 0
        ? await Promise.race([this.timeout(this.requestTimeoutMs), this.request(question)])
        : this.currentRole.welcomeMessage;
    } catch (error) {
      console.log('Error in getAnswer', error);
      this.log.error(error);
      throw new ApiErrorException('Failed to get answer', 500);
    }
  }

  private request(message: string): Promise<string> {
    this.log.info('[FacadeService] request -> ', message);
    return new Promise(async (resolve, reject) => {
      this.storage.create();
      const responseAi = await this.requestFactory(message, this.provider.getSystemRole());
      this.storage.saveText(responseAi);
      this.history.add(Role.ASSISTANT, responseAi);
      this.log.info('[FacadeService] response Ai ->', responseAi);
      resolve(responseAi);
    });
  }

  requestFactory(ask: string, systemRole: SystemRole): Promise<string> {
    return systemRole?.type === SystemType.GAME
      ? this.gameService.handleInput(ask)
      : this.aiService.request(ask);
  }

  private getDelayedAnswer(): Promise<string> {
    const delayedAnswer = Object.assign(this.storage.get());
    this.log.info('[FacadeService] getDelayedAnswer ->', delayedAnswer);
    const isComplete = this.storage.isComplete();
    if (!isComplete) {
      return Promise.resolve(getRandomMessage(this.currentRole.waitMessages));
    }
    this.storage.clear();
    return delayedAnswer.answer;
  }

  private isContinuePhrase(input: string): boolean {
    return this.prepareString(input) === this.currentRole.continuationPhrase;
  }

  private prepareString(message: string): string {
    return message.trim().toLowerCase();
  }

  private timeout(timeMs: number): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(getRandomMessage(this.currentRole.waitMessages));
      }, timeMs);
    });
  }
}
