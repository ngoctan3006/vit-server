import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shares/decorators';
import { MessageDto, PaginationDto, ResponseDto } from 'src/shares/dto';
import { FileUploadDto } from '../auth/dto';
import { JwtGuard } from '../auth/guards';
import { ChangePasswordDto, UpdateUserDto } from './dto';
import { User } from './entities';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('all')
  async getAll(
    @Query() { page, limit }: PaginationDto
  ): Promise<ResponseDto<User[]>> {
    return await this.userService.getAll(page, limit);
  }

  @UseGuards(JwtGuard)
  @Get('management')
  async getManage(): Promise<ResponseDto<User[]>> {
    return { data: await this.userService.getManagement() };
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ResponseDto<User>> {
    return { data: await this.userService.getUserInfoById(id) };
  }

  @UseGuards(JwtGuard)
  @Put('password')
  async changePassword(
    @GetUser('id') id: string,
    @Body() data: ChangePasswordDto
  ): Promise<ResponseDto<MessageDto>> {
    return { data: await this.userService.changePassword(id, data) };
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
    @GetUser('id') id: string,
    @UploadedFile()
    file: Express.Multer.File
  ): Promise<ResponseDto<User>> {
    return { data: await this.userService.changeAvatar(id, file) };
  }

  @UseGuards(JwtGuard)
  @Put('profile')
  async updateProfile(
    @GetUser('id') id: string,
    @Body() data: UpdateUserDto
  ): Promise<ResponseDto<User>> {
    const { fullname, date_join, date_out, gender, status, position, ...rest } =
      data;
    return { data: await this.userService.update(id, rest) };
  }

  // @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.TRUONG_HANH_CHINH)
  // @Put('update-info/:id')
  // async adminUpdateUserInfo(
  //   @Param('id', new ParseIntPipe()) id: number,
  //   @Body() data: UpdateUserDto
  // ): Promise<ResponseDto<User>> {
  //   return { data: await this.userService.update(id, data) };
  // }
}
