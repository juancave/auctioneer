import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(): string {
    return 'App is up and running!';
  }
}
