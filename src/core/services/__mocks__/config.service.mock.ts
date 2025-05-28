import { ConfigApp } from '../../../shared/interfaces';
import { IConfigService } from '../../../shared/interfaces/config-service.interface';

export class MockConfigService implements IConfigService {
  private config: ConfigApp = {
    baseUrl: 'http://mock-api',
    apiKey: 'mock-api-key',
    model: 'mock-model',
    systemRole: 'You are a helpful assistant',
    maxCompletionTokens: '300',
  };

  getInstance(): ConfigApp {
    return this.config;
  }

  getKey<K extends keyof ConfigApp>(key: K): ConfigApp[K] {
    return this.config[key];
  }

  private initConfig(env: NodeJS.ProcessEnv): ConfigApp {
    return this.config;
  }

  setMockConfig(config: Partial<ConfigApp>): void {
    this.config = { ...this.config, ...config };
  }
}
