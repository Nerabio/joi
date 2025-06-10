export interface Provider {
  id: number;
  provider: string;
  apiKey: string;
  baseUrl: string;
  models: ModelsSetting[];
}

export interface ModelsSetting {
  model: string;
  temperature: number;
  max_completion_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface SystemRole {
  name: string;
  role: string;
  type: SystemType;
  state?: any;
}

export enum SystemType {
  DIALOG = 'dialog',
  GAME = 'game',
}
