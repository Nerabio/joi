import { injectable } from 'inversify';
import winston from 'winston';
import util from 'util';

@injectable()
export class LogService {
  private readonly logger: winston.Logger;
  private consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),

    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr =
        Object.values(meta).length > 0
          ? JSON.stringify(meta, null, 2)
          : Object.entries(meta).join(' -> ');

      return `[${timestamp}] ${level}: ${message} ${metaStr}`.trim();
    }),
  );

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.Console({ format: this.consoleFormat }),
        new winston.transports.File({ filename: 'logs/app.log' }),
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
