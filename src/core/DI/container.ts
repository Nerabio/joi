import 'reflect-metadata';
import { Container } from 'inversify';
import { ServicesModule } from './modules/services.module';
import { ControllersModule } from './modules/controllers.module';

const container = new Container();

ControllersModule.register(container);
ServicesModule.register(container);

container.bind(Container).toConstantValue(container);

export { container };
