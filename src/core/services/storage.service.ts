import { injectable } from 'inversify';
import { MessageItem, MessageStatus } from '../../shared/interfaces';

@injectable()
export class StorageService {
  private store: MessageItem = this.create();

  create(): MessageItem | null {
    this.store = {
      time: Date.now(),
      status: MessageStatus.INIT,
    };
    return this.store;
  }

  pending(): MessageItem | null {
    this.store = { ...this.store, status: MessageStatus.PENDING };
    return this.store;
  }

  clear(): void {
    this.store = { ...this.store, status: MessageStatus.CLEAR };
  }

  save(message: string): MessageItem | null {
    this.store = { ...this.store, answer: message, status: MessageStatus.COMPLETE };
    return this.store;
  }

  get(): MessageItem | null {
    return this.store;
  }

  isComplete(): boolean {
    return this.store.status === MessageStatus.COMPLETE;
  }
}
