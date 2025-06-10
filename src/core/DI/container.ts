import 'reflect-metadata';
import { Container } from 'inversify';
import { ServicesModule } from './modules/services.module';
import { ControllersModule } from './modules/controllers.module';
import { GameModule } from './modules/game.module';

const container = new Container();

//GameModule.register(container);
ServicesModule.register(container);
ControllersModule.register(container);

container.bind(Container).toConstantValue(container);

export { container };
