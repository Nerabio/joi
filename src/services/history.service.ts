import { injectable } from "inversify";
import { MessageHistory, Role } from "../interfaces/message-history.interface";

@injectable()
export class HistoryService {
  private map = new Map<number, MessageHistory>();

  add(role: Role, content: string): void {
    this.map.set(Date.now(), { role, content });
  }

  getHistory(): MessageHistory[] {
    return Array.from(this.map)
      .sort((a, b) => a[0] - b[0])
      .map((item) => item[1]);
  }
}
