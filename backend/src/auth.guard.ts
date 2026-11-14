import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class ServiceTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
    }>();
    const expected = process.env.SERVICE_API_TOKEN ?? '';
    const provided = req.headers['x-service-token'] ?? '';
    const first = Buffer.from(expected);
    const second = Buffer.from(provided);
    if (first.length < 24 || first.length !== second.length ||
      !timingSafeEqual(first, second)) {
      throw new UnauthorizedException('a service token is required');
    }
    return true;
  }
}
