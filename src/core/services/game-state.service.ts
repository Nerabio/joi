import { inject, injectable } from 'inversify';
import { LogService } from './log.service';
import { readFileSync, writeFileSync } from 'fs';
import { GameState } from '../../shared/interfaces';
import { ProviderService } from './provider.service';

@injectable()
export class GameStateService {
  private state: GameState;
  private readonly STATE_FILE = 'temps/game-state.json';

  constructor(
    @inject(ProviderService) private readonly providerService: ProviderService,
    private readonly log: LogService,
  ) {
    this.loadState();
  }

  private loadState(): void {
    try {
      const data = readFileSync(this.STATE_FILE, 'utf-8');
      this.state = JSON.parse(data);
    } catch (error) {
      this.log.warn('Creating new game state');
      this.state = this.getInitialState();
      this.saveState();
    }
  }

  private saveState(): void {
    writeFileSync(this.STATE_FILE, JSON.stringify(this.state, null, 2));
  }

  getInitialState(): GameState | null {
    const systemRole = this.providerService.getSystemRole();
    return systemRole?.state;
  }

  getState(): GameState | null {
    return this.state;
  }

  updateState(updates: Partial<GameState>): void {
    this.state = this.deepMerge(this.state, updates);
    this.saveState();
  }

  private deepMerge(state: GameState, updates: Partial<GameState>): GameState {
    const merge = (target: any, source: any): any => {
      if (typeof target === 'object' && typeof source === 'object') {
        for (const key in source) {
          if (source[key] !== null && typeof source[key] === 'object') {
            target[key] = merge(target[key] ?? {}, source[key]);
          } else {
            target[key] = source[key];
          }
        }
        return target;
      }
      return source;
    };

    return merge({ ...state }, updates);
  }
}
