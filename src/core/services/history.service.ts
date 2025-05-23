import { injectable } from "inversify";
import { MessageHistory, Role } from "../../shared/interfaces";

@injectable()
export class HistoryService {
  private readonly MAX_HISTORY = 1000;
  private history: MessageHistory[] = [];

  add(role: Role, content: string): void {
    this.history.push({ role, content });
    if (this.history.length > this.MAX_HISTORY) {
      this.history.shift();
    }
  }

  getLastHistory(count: number = 0): MessageHistory[] {
    return count > 0
        ? this.history.slice(-count)
        : [...this.history];
  }

  

}
