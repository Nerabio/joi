import { injectable } from 'inversify';
import { ConfigApp } from '../../shared/interfaces';
import { snakeToCamel } from '../../shared/utils/snake-to-camel';
import { IConfigService } from '../../shared/interfaces/config-service.interface';

@injectable()
export class ConfigService implements IConfigService {
  private readonly config: ConfigApp;

  constructor() {
    this.config = this.initConfig(process.env);
  }

  getInstance(): ConfigApp {
    return this.config;
  }

  getKey<K extends keyof ConfigApp>(key: K): ConfigApp[K] {
    if (!(key in this.config)) {
      console.warn(`Config key "${String(key)}" not found`);
    }
    return this.config[key];
  }

  private initConfig(env: NodeJS.ProcessEnv): ConfigApp {
    const config: ConfigApp = {};

    for (const key in env) {
      if (env.hasOwnProperty(key)) {
        const configKey = snakeToCamel(key) as keyof ConfigApp;
        config[configKey] = env[key] as any;
      }
    }
    return config;
  }
}
