import { injectable } from 'inversify';
import { ConfigService } from './config.service';
import { LogService } from './log.service';
import { Provider, SyslemRole } from '../../shared/interfaces';

@injectable()
export class ProviderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly log: LogService,
  ) {}

  getProvider(): Provider {
    const providers = this.configService.getCollection<Provider[]>('providers');
    return providers.find((p) => p.provider === 'openrouter.ai');
  }

  getSystemRole(): SyslemRole {
    const roles = this.configService.getCollection<SyslemRole[]>('roles');
    return roles.find((r) => r.name === 'passionate_girl');
  }
}
