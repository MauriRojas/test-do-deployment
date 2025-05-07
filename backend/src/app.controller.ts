import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './guards/auth.guard';
import { AuthenticatedRequest } from './auth/auth.types';

@Controller()
export class AppController {
  @UseGuards(SupabaseAuthGuard)
  @Get('private')
  getProtected(@Req() req: AuthenticatedRequest) {
    return {
      message: 'Access granted',
      user: req['user'],
    };
  }
}
