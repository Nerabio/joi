import {NextFunction, Request, Response} from "express";
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`, {
        body: req.body,
        params: req.params,
        query: req.query
    });
    next();
};