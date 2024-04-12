import { AuthService } from './../service/auth.service';
import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constants/role.enum';
import { Response, Request } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegisterDTO } from 'src/user/dto/user.register.dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { JwtAuthGuard } from '../jwt/access-auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { RefreshAuthGuard } from '../jwt/refresh-auth.guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: UserRegisterDTO })
  @Post('email/register')
  async register(@Body() body: UserRegisterDTO): Promise<void> {
    return await this.authService.register(body);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: AuthLoginDto })
  @Post('email/login')
  login(
    @Body() body: AuthLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.jwtLocalLogin(body, response);
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.getNewAccessToken(request, response);
  }

  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.logout(request, response);
  }

  @ApiOperation({ summary: '유저 목록' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('user')
  async getUser(@Req() request: Request) {
    return this.authService.getUser(request);
  }
}
