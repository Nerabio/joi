export interface MessageItem {
  answer?: string;
  time: number;
  status: "pending" | "complete";
}
