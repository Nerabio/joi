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
      if (Array.isArray(target) && Array.isArray(source)) {
        // Если оба значения - массивы, объединяем их
        return [...target, ...source];
      } else if (
        typeof target === 'object' &&
        target !== null &&
        typeof source === 'object' &&
        source !== null
      ) {
        // Если оба значения - объекты (не null), рекурсивно объединяем
        const result = { ...target };
        for (const key in source) {
          if (source.hasOwnProperty(key)) {
            if (key in target) {
              result[key] = merge(target[key], source[key]);
            } else {
              result[key] = source[key];
            }
          }
        }
        return result;
      }
      // Для всех остальных случаев заменяем целевое значение исходным
      return source;
    };

    return merge({ ...state }, updates);
  }
}
