export interface IAiService {
  request(ask: string): Promise<string>;
}
