import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CurrentUserData } from 'src/common/interfaces/current-user-data.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'jwtsecret',
    });
  }

  async validate(payload: CurrentUserData): Promise<{
    id: string;
    email: string;
    role: string;
  }> {
    const user = await this.usersService.findById(payload.sub, false);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid token');
    }

    // Return user data that will be available in the request object
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
