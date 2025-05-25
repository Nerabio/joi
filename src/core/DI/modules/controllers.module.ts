import { Main, Users } from '../../../controllers';
import { Container, injectable } from 'inversify';

@injectable()
export class ControllersModule {
  public static register(container: Container): void {
    container.bind(Main).toSelf().inSingletonScope();
    container.bind(Users).toSelf().inSingletonScope();
  }
}
