import { Router } from "express";
import { DecoratorRegisterFunction } from "../shared/interfaces/decorator-register-function.type";
export const appGetRouter = Router();

function getDecorator(path: string): DecoratorRegisterFunction {
  return (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ): void => {
    const prefix = target.constructor.name.toLowerCase();
    const pathRoute = `/${prefix}${path}`;
    appGetRouter["get"](pathRoute, descriptor.value);
  };
}

function routeDecorator(
  method: "get" | "post" | "put" | "delete",
  path: string
): DecoratorRegisterFunction {
  return (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ): void => {
    const prefix = target.constructor.name.toLowerCase();
    const pathRoute = `/${prefix}${path}`;
    appGetRouter[method](pathRoute, descriptor.value);
  };
}

// Затем можно создать конкретные декораторы для удобства
export const Get = (path: string) => routeDecorator("get", path);
export const Post = (path: string) => routeDecorator("post", path);
export default Post;
