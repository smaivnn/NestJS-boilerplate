import { AuthService } from './../service/auth.service';
import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Res,
  Req,
  Query,
  Redirect,
  Patch,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constants/role.enum';
import { Response, Request } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegisterDTO } from 'src/auth/dto/auth.register.dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { JwtAuthGuard } from '../jwt/access-auth.guard';
import { GoogleAuthGuard } from '../jwt/google.auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { RefreshAuthGuard } from '../jwt/refresh-auth.guards';
import { AuthGuard } from '@nestjs/passport';
import { AuthChangePasswordDto } from '../dto/auth.change.password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: UserRegisterDTO })
  @Post('register/email')
  async register(@Body() body: UserRegisterDTO): Promise<void> {
    return await this.authService.register(body);
  }

  @ApiOperation({ summary: '이메일 가입 확인 인증' })
  @Post('activate/email')
  async activateRegisterAccount(@Query('email') email: string): Promise<void> {
    return await this.authService.activateRegisterAccount(email);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: AuthLoginDto })
  @Post('login/email')
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

  @ApiOperation({ summary: '아이디 찾기' })
  @UseGuards(JwtAuthGuard)
  @Post('find/email')
  findUserEmail() {
    // TODO: 핸드폰 인증이 구현 되면 추가
    console.log('findUserEmail');
  }

  @ApiOperation({ summary: '비밀번호 재발급' })
  @UseGuards(JwtAuthGuard)
  @Post('find/password')
  resetPassword() {
    // TODO: 핸드폰 인증이 구현 되면 추가
    console.log('findPassword');
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @UseGuards(JwtAuthGuard)
  @Patch('change/password')
  changePassword(@Req() request, @Body() body: AuthChangePasswordDto) {
    // TODO: 나중에 유저 로그아웃 시키고 다시 로그인 하도록 하기
    return this.authService.changePassword(request, body);
  }

  @ApiOperation({ summary: '구글 로그인' })
  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  googleLogin(@Req() request) {}

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  @Redirect('http://localhost:5000')
  async googleLoginRedirect(@Req() request, @Res() response) {
    return this.authService.setRefreshTokenToUser(request.user, response);
  }

  @ApiOperation({ summary: '유저 목록' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('user')
  async getUser(@Req() request: Request) {
    return this.authService.getUser(request);
  }
}
