import { Router } from "express";
import { DecoratorRegisterFunction } from "../shared/interfaces/decorator-register-function.type";
export const appGetRouter = Router();

function getDecorator(path: string): DecoratorRegisterFunction {   
    return (target: any, methodName: string, descriptor: PropertyDescriptor): void => {
        const prefix = target.constructor.name.toLowerCase();
        const pathRoute = `/${prefix}${path}`;
        appGetRouter['get'](pathRoute, descriptor.value);
    };
}
export default getDecorator;