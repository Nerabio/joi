import "reflect-metadata";
import { Router } from "express";
import { container } from "../container";
export const appRouter = Router();

// Типы для удобства
type HttpMethod = "get" | "post" | "put" | "delete" | "patch";
interface RouteOptions {
  path: string;
  method: HttpMethod;
}

// Ключ для хранения метаданных класса
const CONTROLLER_PREFIX_METADATA_KEY = "controller:prefix";

// Декоратор класса — задаёт базовый путь для всех методов
export function controller(prefix: string = "") {
  return (target: any) => {
    Reflect.defineMetadata(CONTROLLER_PREFIX_METADATA_KEY, prefix, target);
  };
}

// Декоратор метода — регистрирует маршрут
// export function route(options: RouteOptions): MethodDecorator {
//   return (
//     target: any,
//     methodName: string | symbol,
//     descriptor: PropertyDescriptor
//   ) => {
//     const controllerPrefix =
//       Reflect.getMetadata(CONTROLLER_PREFIX_METADATA_KEY, target.constructor) ||
//       "";
//     const fullPath = `${controllerPrefix}${options.path}`.replace("//", "/"); // Убираем дублирующиеся слеши

//     appRouter[options.method](fullPath, descriptor.value);
//   };
// }

export function route(options: RouteOptions): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const controllerPrefix =
      Reflect.getMetadata(CONTROLLER_PREFIX_METADATA_KEY, target.constructor) ||
      "";
    const fullPath = `${controllerPrefix}${options.path}`.replace("//", "/");

    // Заменяем descriptor.value на обёртку, которая создаёт инстанс через DI
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Получаем экземпляр контроллера из DI-контейнера
      const controllerInstance = container.get(target.constructor);

      // Вызываем оригинальный метод с правильным контекстом (this)
      return originalMethod.apply(controllerInstance, args);
    };

    appRouter[options.method](fullPath, descriptor.value);
  };
}

// Удобные декораторы для методов
export const Get = (path: string = "") => route({ path, method: "get" });
export const Post = (path: string = "") => route({ path, method: "post" });
export const Put = (path: string = "") => route({ path, method: "put" });
export const Delete = (path: string = "") => route({ path, method: "delete" });
