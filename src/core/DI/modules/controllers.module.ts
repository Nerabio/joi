import { Main, Users } from '../../../controllers';
import { Container, injectable } from 'inversify';

@injectable()
export class ControllersModule {
  public static register(container: Container): void {
    const controllers = [Main, Users];
    controllers.forEach(controller => {
      container.bind(controller).toSelf().inSingletonScope();
    });
  }
}
