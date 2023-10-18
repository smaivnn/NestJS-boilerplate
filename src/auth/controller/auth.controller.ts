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
import { ApiOperation } from '@nestjs/swagger';
import { UserRequestDto } from 'src/user/dto/user.request.dto';
import { LoginRequestDto } from '../dto/login.request.dto';
import { JwtAuthGuard } from '../jwt/access-auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { RefreshAuthGuard } from '../jwt/refresh-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signup(@Body() body: UserRequestDto) {
    return await this.authService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(
    @Body() data: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.jwtLocalLogin(data, response, request);
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.getNewAccessToken(request.user, response);
  }

  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.logout(request.user, response);
  }

  @ApiOperation({ summary: '유저 목록' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('user')
  async getUser(@Req() request: Request) {
    return this.authService.getUser(request);
  }
}
