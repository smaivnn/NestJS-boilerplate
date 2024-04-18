import { Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor() {}

  @ApiOperation({ summary: '이메일 수신 테스트' })
  @Post('verify')
  async verifyEmail(@Query('token') token: string) {
    return console.log(`${token} 이메일 수신 테스트`);
  }
}
