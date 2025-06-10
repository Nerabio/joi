import { Container, injectable } from 'inversify';
import { GameStateService } from '../../services/game-state.service';
import { GameSessionService } from '../../services/game-session.service';

@injectable()
export class GameModule {
  public static register(container: Container): void {
    const services = [GameStateService, GameSessionService];
    services.forEach((service) => {
      container.bind(service).toSelf().inSingletonScope();
    });
  }
}
