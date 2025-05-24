import {SettingsAi} from "../../shared/interfaces";
import {injectable} from "inversify";
import OpenAI from "openai";

@injectable()
export class OpenAIFactory {
    create(settings: SettingsAi): OpenAI {
        if (!settings.apiKey) {
            throw new Error('OpenAI API key is required');
        }
        return new OpenAI({
            baseURL: settings.baseURL,
            apiKey: settings.apiKey,
        });
    }
}
