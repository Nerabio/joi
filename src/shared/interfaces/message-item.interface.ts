export interface MessageItem {
  answer?: string;
  time: number;
  status: MessageStatus;
}

export enum MessageStatus {
  INIT = 'init',
  CLEAR = 'clear',
  PENDING = 'pending',
  COMPLETE = 'complete',
}
