import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/access-auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constants/role.enum';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 목록 조회',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiOperation({
    summary: '유저 역할 수정',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/roles')
  async updateRoles(@Param('id') id: string, @Body('role') role: Role) {
    return await this.userService.updateUserRoles(id, role);
  }
}
