import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    Logger.log(
      `Request to ${req.originalUrl} with method ${req.method}`,
      'RequestInterceptor',
    );
    next();
  }
}
