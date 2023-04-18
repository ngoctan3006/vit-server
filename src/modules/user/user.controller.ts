import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async getUserById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<User> {
    return await this.userService.getUserInfoById(id);
  }

  @UseGuards(JwtGuard)
  @Put('/password')
  async changePassword(
    @GetUser('id') id: number,
    @Body() data: ChangePasswordDto
  ): Promise<{ message: string }> {
    return { message: await this.userService.changePassword(id, data) };
  }
}
