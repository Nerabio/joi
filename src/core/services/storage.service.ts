import { injectable } from 'inversify';
import { MessageItem, MessageStatus } from '../../shared/interfaces';

@injectable()
export class StorageService {
  private store: MessageItem = this.create();

  create(): MessageItem | null {
    this.store = {
      time: Date.now(),
      status: MessageStatus.PENDING,
    };
    return this.store;
  }

  clear(): void {
    this.store = null;
  }

  saveText(message: string): MessageItem | null {
    this.store = { ...this.store, answer: message, status: MessageStatus.COMPLETE };
    return this.store;
  }

  get(): MessageItem | null {
    return this.store;
  }
}
