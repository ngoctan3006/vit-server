import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Activity, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { PaginationDto } from 'src/shares/dto/pagination.dto';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { GetUser } from 'src/shares/decorators/get-user.decorator';

@Controller('activity')
@ApiTags('activity')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() pagination: PaginationDto
  ): Promise<ResponseDto<Activity[]>> {
    return await this.activityService.findAll(
      +pagination.page,
      +pagination.limit
    );
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Get('trash')
  async findAllDeleted(
    @Query() pagination: PaginationDto
  ): Promise<ResponseDto<Activity[]>> {
    return await this.activityService.findAllDeleted(
      +pagination.page,
      +pagination.limit
    );
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseDto<Activity>> {
    return await this.activityService.findOne(+id);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Get('trash/:id')
  async findOneDeleted(
    @Param('id') id: number
  ): Promise<ResponseDto<Activity>> {
    return await this.activityService.findOneDeleted(+id);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Post()
  async create(
    @Body() data: CreateActivityDto
  ): Promise<ResponseDto<Activity>> {
    return await this.activityService.create(data);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateActivityDto
  ): Promise<ResponseDto<Activity>> {
    return await this.activityService.update(+id, data);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Delete(':id')
  async softDelete(
    @Param('id') id: number
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.activityService.softDelete(+id);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Put('restore/:id')
  async restore(@Param('id') id: number): Promise<ResponseDto<Activity>> {
    return await this.activityService.restore(+id);
  }

  @UseGuards(JwtGuard)
  @Put('register/:id')
  async register(
    @GetUser('id') userId: number,
    @Param('id') activityId: number
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.activityService.register(userId, +activityId);
  }

  @UseGuards(JwtGuard)
  @Put('cancel/:id')
  async cancelRegister(
    @GetUser('id') userId: number,
    @Param('id') activityId: number
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.activityService.cancelRegister(userId, +activityId);
  }
}
