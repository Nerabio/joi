import { injectable } from "inversify";
import winston from "winston";

@injectable()
export class LogService {
    private readonly logger: winston.Logger;

    constructor() {
      this.logger = winston.createLogger({
        level: "info",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: "logs/app.log" }),
        ],
      });
    }
  
    info(message: string, meta?: any): void {
      this.logger.info(message, meta);
    }
  
    warn(message: string, meta?: any): void {
      this.logger.warn(message, meta);
    }
  
    error(message: string, meta?: any): void {
      this.logger.error(message, meta);
    }
}
