// import { IConfigService } from '../../shared/interfaces/config-service.interface';
// import { IAiService } from '../../shared/interfaces/iai-service.interface';
// import { container } from '../DI/container';
// import { OpenAIFactory } from '../factories/openai.factory';
// import { MockConfigService } from './__mocks__/config.service.mock';
// import { MockOpenAIFactory } from './__mocks__/openai.factory.mock';
// import { AiService } from './ai.service';
// import { ConfigService } from './config.service';
// import { HistoryService } from './history.service';

// export class MockAiService implements IAiService {
//   async request(ask: string): Promise<string> {
//     return 'Mock response';
//   }
// }

// describe('AiService', () => {
//   let aiService: AiService;
//   let configService: ConfigService;
//   let historyService: HistoryService;

//   beforeAll(() => {
//     container.unbind(OpenAIFactory);
//     container.unbind(ConfigService);
//     //  container.bind(OpenAIFactory).to(MockOpenAIFactory);
//     container.bind<IConfigService>(ConfigService).to(MockConfigService);

//     configService = container.get(ConfigService);
//     historyService = container.get(HistoryService);
//     aiService = container.get(AiService);
//   });

//   afterAll(() => {
//     container.unbind(OpenAIFactory);
//     container.unbind(ConfigService);
//     container.bind(OpenAIFactory).to(OpenAIFactory);
//     container.bind(ConfigService).to(ConfigService);
//   });

//   it('should return mocked AI response', async () => {
//     const response = await aiService.request('Test question');
//     expect(response).toBe('Mocked AI response');
//   });

//   it('should create messages correctly', () => {
//     const messages = aiService.makeMessage(
//       'test',
//       {
//         baseURL: 'http://test',
//         apiKey: 'test',
//         model: 'test',
//         systemRole: 'You are a test assistant',
//       },
//       [],
//     );

//     expect(messages.length).toBe(2);
//     expect(messages[0].role).toBe('system');
//     expect(messages[1].role).toBe('user');
//   });
// });
