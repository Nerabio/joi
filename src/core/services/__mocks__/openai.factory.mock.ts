import { SettingsAi } from '../../../shared/interfaces';

export class MockOpenAIFactory {
  create(settings: SettingsAi): any {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Mocked AI response' } }],
          }),
        },
      },
    };
  }
}
