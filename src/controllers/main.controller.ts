import { Request, Response } from 'express';
import { Post, controller } from '../core/decorators';
import { injectable } from 'inversify';
import { HistoryService, FacadeService } from '../core/services';

@controller('/')
@injectable()
export class Main {
  constructor(
    private readonly facade: FacadeService,
  ) {}

  @Post('/main')
  async getAnswer(req: Request, res: Response): Promise<void> {
    const { original_utterance } = req.body.request;
    const message = await this.facade.getAnswer(original_utterance);
    res.json({
      response: {
        text: message,
        tts: message,
        end_session: false,
      },
      version: '1.0',
    });
  }
}
