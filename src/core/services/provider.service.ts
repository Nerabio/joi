import { injectable } from 'inversify';
import { ConfigService } from './config.service';
import { LogService } from './log.service';
import { Provider, SystemRole } from '../../shared/interfaces';

@injectable()
export class ProviderService {
  private readonly providers: Provider[];
  private readonly systemRole: SystemRole[];
  constructor(
    private readonly configService: ConfigService,
    private readonly log: LogService,
  ) {
    this.providers = this.configService.getCollection<Provider[]>('providers');
    this.systemRole = this.configService.getCollection<SystemRole[]>('roles');
  }

  getProvider(): Provider {
    return this.providers.find((p) => p.provider === 'openrouter.ai');
  }

  getSystemRole(): SystemRole {
    return this.systemRole.find((r) => r.name === 'space_traveler');
  }

  updateSystemRole(newSystemRole: string): void {
    const systemRole = this.getSystemRole();
    if (systemRole) {
      systemRole.role = newSystemRole;
      this.log.info(newSystemRole);
    }
  }
}
