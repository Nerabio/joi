import { injectable } from "inversify";
import { MessageItem } from "../interfaces/message-item.interface";

@injectable()
export class StorageService {
  private store: MessageItem = this.create();

  create(): MessageItem | null {
    this.store = {
      time: Date.now(),
      status: "pending",
    };
    return this.store;
  }
  clear(): void {
    this.store = null;
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
