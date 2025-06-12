import { injectable } from 'inversify';
import { ConfigService } from './config.service';
import { LogService } from './log.service';
import { ModelsSetting, Provider, SystemRole } from '../../shared/interfaces';
import Handlebars from 'handlebars';

@injectable()
export class ProviderService {
  private readonly providers: Provider[];
  private readonly systemRole: SystemRole[];
  private currentRole: SystemRole;
  private currentProvider: Provider;
  private currentModel: ModelsSetting;
  private systemPromtTemplate: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly log: LogService,
  ) {
    this.providers = this.configService.getCollection<Provider[]>('providers');
    this.systemRole = this.configService.getCollection<SystemRole[]>('roles');

    this.currentProvider = this.providers.find((p) => p.provider === 'together');
    this.currentModel = this.currentProvider.models[0];
    this.currentModel = this.setDefaultModelParams(this.currentModel);
    this.currentRole = this.systemRole.find((r) => r.name === 'space_traveler');
    this.currentRole = this.setDefaultSystemPhrase(this.currentRole);

    this.systemPromtTemplate = this.currentRole.role;
  }

  getModelSetting(): ModelsSetting {
    return this.currentModel;
  }

  getProvider(): Provider {
    return this.currentProvider;
  }

  getSystemRole(): SystemRole {
    return this.currentRole;
  }

  getSystemPromtTemplate(): string {
    return this.systemPromtTemplate;
  }

  updateSystemRole(newSystemRole: string): void {
    const systemRole = this.getSystemRole();
    if (systemRole) {
      systemRole.role = newSystemRole;
      this.log.info('[ProviderService] updateSystemRole ->', newSystemRole);
    }
  }

  private setDefaultModelParams(model: ModelsSetting): ModelsSetting {
    model.temperature = model?.temperature ?? +this.configService.getKey('temperature');
    model.max_completion_tokens =
      model?.max_completion_tokens ?? +this.configService.getKey('temmax_completion_tokenserature');
    model.top_p = model?.top_p ?? +this.configService.getKey('top_p');
    model.frequency_penalty =
      model?.frequency_penalty ?? +this.configService.getKey('frequency_penalty');
    model.presence_penalty =
      model?.presence_penalty ?? +this.configService.getKey('presence_penalty');

    return model;
  }

  private setDefaultSystemPhrase(role: SystemRole): SystemRole {
    role.continuationPhrase =
      role?.continuationPhrase ?? this.configService.getKey('continuationPhrase');
    role.welcomeMessage = role?.welcomeMessage ?? this.configService.getKey('welcomeMessage');
    role.waitMessages =
      role?.waitMessages?.length > 0
        ? role.waitMessages
        : this.configService.getCollection('waitMessages');

    role.waitMessages = role.waitMessages.map((sourceMessage) => {
      const template = Handlebars.compile(sourceMessage);
      return template({ phrase: role.continuationPhrase });
    });
    return role;
  }
}
