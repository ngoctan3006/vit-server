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
import { Activity, ActivityTime, Position } from '@prisma/client';
import { GetUser, Roles } from 'src/shares/decorators';
import { MessageDto, PaginationDto, ResponseDto } from 'src/shares/dto';
import { JwtGuard } from '../auth/guards';
import { ActivityService } from './activity.service';
import {
  ApproveDto,
  CreateActivityDto,
  RegistryActivityDto,
  UpdateActivityDto,
} from './dto';

@Controller('activity')
@ApiTags('activity')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<
    ResponseDto<
      Array<
        Activity & {
          times: Omit<ActivityTime, 'activity_id'>[];
        }
      >
    >
  > {
    return await this.activityService.findAll(
      pagination.page,
      pagination.limit
    );
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Get('trash')
  async findAllDeleted(@Query() pagination: PaginationDto): Promise<
    ResponseDto<
      Array<
        Activity & {
          times: Omit<ActivityTime, 'activity_id'>[];
        }
      >
    >
  > {
    return await this.activityService.findAllDeleted(
      pagination.page,
      pagination.limit
    );
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    return await this.activityService.findOne(+id);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Get('trash/:id')
  async findOneDeleted(@Param('id') id: number): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    return await this.activityService.findOneDeleted(+id);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Post()
  async create(@Body() data: CreateActivityDto): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    return await this.activityService.create(data);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateActivityDto
  ): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    return await this.activityService.update(+id, data);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Delete(':id')
  async softDelete(@Param('id') id: number): Promise<ResponseDto<MessageDto>> {
    return await this.activityService.softDelete(+id);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Put('restore/:id')
  async restore(@Param('id') id: number): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    return await this.activityService.restore(+id);
  }

  @UseGuards(JwtGuard)
  @Post('register')
  async register(
    @GetUser('id') userId: number,
    @Body() data: RegistryActivityDto
  ): Promise<ResponseDto<MessageDto>> {
    return await this.activityService.register(userId, data);
  }

  @UseGuards(JwtGuard)
  @Put('cancel/:id')
  async cancelRegister(
    @GetUser('id') userId: number,
    @Param('id') timeId: number
  ): Promise<ResponseDto<MessageDto>> {
    return await this.activityService.cancelRegister(userId, +timeId);
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Post('approve')
  async approveUser(
    @Body() data: ApproveDto
  ): Promise<ResponseDto<MessageDto>> {
    return await this.activityService.approve(data);
  }
}
