import { Router } from 'express';
import { RouteOptions } from '../shared/interfaces/route-options.interface';
import { DecoratorRegisterFunction } from '../shared/interfaces/decorator-register-function.type';
export const appRouter = Router();


function routesDecorator(options: RouteOptions): DecoratorRegisterFunction {
    return (target: any, methodName: string, descriptor: PropertyDescriptor): void => {
        const prefix = target.constructor.name.toLowerCase();
        const path = `/${prefix}${options.path}`;
       appRouter[options.requestMethod](path, descriptor.value);
    };
}
export default routesDecorator;