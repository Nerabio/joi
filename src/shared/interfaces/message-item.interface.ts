export interface MessageItem {
  answer?: string;
  time: number;
  status: MessageStatus;
}

export enum MessageStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
}
