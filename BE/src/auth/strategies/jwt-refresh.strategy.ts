import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { CurrentUserData } from 'src/common/interfaces/current-user-data.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') ?? 'jwtrefreshsecret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: CurrentUserData): Promise<CurrentUserData> {
    // Extract the refresh token from the request
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // Check if user exists and is not deleted
    const user = await this.usersService.findById(payload.sub, false);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid token');
    }

    // Return user data with refresh token
    return {
      ...payload,
      refreshToken,
    } as CurrentUserData;
  }
}
