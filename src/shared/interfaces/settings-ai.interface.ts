export interface SettingsAi {
  baseURL: string;
  apiKey: string;
  model: string;
  systemRole: string;
  maxCompletionTokens?: number;
}
