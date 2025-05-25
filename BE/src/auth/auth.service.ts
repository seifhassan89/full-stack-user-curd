import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserData } from 'src/common/interfaces/current-user-data.interface';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokensDto } from './dto/tokens.dto';
import { PasswordHelper } from 'src/common/utils/password.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokensDto> {
    // Check if user already exists
    const existingUser = await this.usersService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      // Default role for new users
      role: registerDto.role ?? 'user',
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Update refresh token in the database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<TokensDto> {
    // Find user by email
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Check if user is soft deleted
    if (user.deletedAt) {
      throw new UnauthorizedException('This account has been deleted');
    }

    // Validate password
    const isPasswordValid = await PasswordHelper.comparePasswords(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    // Update refresh token in the database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<TokensDto> {
    // Find user
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    // Verify refresh token
    const isRefreshTokenValid = await this.compareRefreshTokens(refreshToken, user.refreshToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Update refresh token in the database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    // Remove refresh token from the database
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateUser(payload: CurrentUserData): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  private async generateTokens(userId: string, email: string, role: string): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: this.configService.get<string>('jwt.expiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await PasswordHelper.hashPassword(refreshToken);

    // Update user with hashed refresh token
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }

  private async compareRefreshTokens(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    return PasswordHelper.comparePasswords(refreshToken, hashedRefreshToken);
  }
}
