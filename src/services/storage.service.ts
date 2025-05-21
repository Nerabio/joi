import { injectable } from "inversify";
import { MessageItem } from "../interfaces/message-item.interface";

@injectable()
export class StorageService {
  private store: MessageItem;

  create(messageId: number): MessageItem | null {
    this.store = {
      messageId,
      time: Date.now(),
      status: "pending",
    };
    return this.store;
  }

  saveText(message: string): MessageItem | null {
    this.store.answer = message;
    this.store.status = "complete";
    return this.store;
  }

  get(): MessageItem | null {
    return this.store;
  }
}
