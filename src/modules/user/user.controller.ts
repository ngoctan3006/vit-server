import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { FileUploadDto } from '../auth/dto/file-upload.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
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
  @Put('password')
  async changePassword(
    @GetUser('id') id: number,
    @Body() data: ChangePasswordDto
  ): Promise<{ message: string }> {
    return { message: await this.userService.changePassword(id, data) };
  }

  @UseGuards(JwtGuard)
  @Put('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar image file (jpg, jpeg, png, gif)',
    type: FileUploadDto,
  })
  async changeAvatar(
    @GetUser('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/,
          }),
        ],
      })
    )
    file: Express.Multer.File
  ): Promise<User> {
    return await this.userService.changeAvatar(id, file);
  }

  @UseGuards(JwtGuard)
  @Put('profile')
  async updateProfile(
    @GetUser('id') id: number,
    @Body() data: UpdateUserDto
  ): Promise<User> {
    return await this.userService.update(id, data);
  }
}
