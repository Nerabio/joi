import { RequestMethod } from "./http-method.enum";

export interface RouteOptions {
    path: string;
    requestMethod: keyof typeof RequestMethod;
    middlewares?: any[],
}

