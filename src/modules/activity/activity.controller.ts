import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Activity, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
@ApiTags('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<ResponseDto<Activity[]>> {
    return await this.activityService.findAll(+page, +limit);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseDto<Activity>> {
    return await this.activityService.findOne(+id);
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
}
