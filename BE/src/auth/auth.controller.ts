import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserData } from 'src/common/interfaces/current-user-data.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SwaggerApiDocumentation } from '../common/decorators/swagger-api-documentation.decorator';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokensDto } from './dto/tokens.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerApiDocumentation({
    summary: 'Register a new user',
    modelType: TokensDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<TokensDto> {
    const tokens = await this.authService.register(registerDto);
    return tokens;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiDocumentation({
    summary: 'Login with email and password',
    modelType: TokensDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<TokensDto> {
    const tokens = await this.authService.login(loginDto);
    return tokens;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @SwaggerApiDocumentation({
    summary: 'Refresh access token using refresh token',
    modelType: TokensDto,
  })
  async refreshTokens(@CurrentUser() user: CurrentUserData): Promise<TokensDto> {
    const tokens = await this.authService.refreshTokens(user.sub, user.refreshToken);
    return tokens;
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @SwaggerApiDocumentation({
    summary: 'Logout user (invalidate refresh token)',
    modelType: Object,
  })
  async logout(@CurrentUser() user: CurrentUserData): Promise<void> {
    await this.authService.logout(user.sub);
  }
}
