import { Provider } from '../../shared/interfaces';
import { injectable } from 'inversify';
import OpenAI from 'openai';
import https from 'https';

@injectable()
export class OpenAIFactory {
  create(provider: Provider): OpenAI {
    if (!provider.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const keepAliveAgent = new https.Agent({
      keepAlive: true,
      maxSockets: 5,
      timeout: 10000,
    });

    return new OpenAI({
      baseURL: provider.baseUrl,
      apiKey: provider.apiKey,
      httpAgent: keepAliveAgent,
    });
  }
}
