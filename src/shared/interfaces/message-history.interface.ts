export enum Role {
  USER = 'user',
  SYSTEM = 'system',
  ASSISTANT = 'assistant',
}

export interface MessageHistory {
  role: Role;
  content: string;
}
