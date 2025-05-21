export interface MessageItem {
  messageId: number;
  answer?: string;
  time: number;
  status: "pending" | "complete";
}
