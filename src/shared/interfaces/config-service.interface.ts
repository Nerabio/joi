import { ConfigApp } from './config-app.interface';

export interface IConfigService {
  getInstance(): ConfigApp;
  getKey<K extends keyof ConfigApp>(key: K): ConfigApp[K];
}
