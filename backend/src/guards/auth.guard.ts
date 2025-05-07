import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { SupabaseJwtPayload } from 'src/auth/auth.types';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!authHeader || !authHeader.startsWith('Bearer ') || !token) {
      console.warn('[AuthGuard] Missing token');
      throw new UnauthorizedException('Missing token');
    }

    const secret = this.config.get<string>('SUPABASE_JWT_SECRET');
    if (!secret) {
      console.error('[AuthGuard] Missing SUPABASE_JWT_SECRET');
      throw new UnauthorizedException('Server misconfiguration');
    }

    try {
      const payload = this.jwt.verify<SupabaseJwtPayload>(token, { secret });
      request['user'] = payload;
      return true;
    } catch (err) {
      console.error('[AuthGuard] Token verification failed:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
