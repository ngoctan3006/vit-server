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
  ActivityResponse,
  ApproveDto,
  CreateActivityDto,
  GetMemberResponseDto,
  RegistryActivityDto,
  TopMember,
  UpdateActivityDto,
} from './dto';

@Controller('activity')
@ApiTags('activity')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() pagination: PaginationDto
  ): Promise<ResponseDto<ActivityResponse[]>> {
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
          times: Omit<ActivityTime, 'activityId'>[];
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
  @Get('top-member')
  async getTopMember(): Promise<ResponseDto<TopMember[]>> {
    return { data: await this.activityService.getTopMember() };
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<ResponseDto<ActivityResponse>> {
    return { data: await this.activityService.findOne(id) };
  }

  @UseGuards(JwtGuard)
  @Get('member/:id')
  async getMember(
    @Param('id') id: string
  ): Promise<ResponseDto<GetMemberResponseDto[]>> {
    return { data: await this.activityService.getMember(id) };
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Get('trash/:id')
  async findOneDeleted(
    @Param('id') id: string
  ): Promise<ResponseDto<ActivityResponse>> {
    return { data: await this.activityService.findOneDeleted(id) };
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Post()
  async create(
    @Body() data: CreateActivityDto
  ): Promise<ResponseDto<ActivityResponse>> {
    return { data: await this.activityService.create(data) };
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateActivityDto
  ): Promise<ResponseDto<ActivityResponse>> {
    return { data: await this.activityService.update(id, data) };
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<ResponseDto<MessageDto>> {
    return { data: await this.activityService.softDelete(id) };
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Put('restore/:id')
  async restore(@Param('id') id: string): Promise<ResponseDto<MessageDto>> {
    return { data: await this.activityService.restore(id) };
  }

  @UseGuards(JwtGuard)
  @Post('register')
  async register(
    @GetUser('id') userId: string,
    @Body() data: RegistryActivityDto
  ): Promise<ResponseDto<MessageDto>> {
    return { data: await this.activityService.register(userId, data) };
  }

  @UseGuards(JwtGuard)
  @Put('withdrawn/:id')
  async withdrawn(
    @GetUser('id') userId: string,
    @Param('id') timeId: string
  ): Promise<ResponseDto<MessageDto>> {
    return { data: await this.activityService.withdrawn(userId, timeId) };
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Post('approve')
  async approveUser(
    @Body() data: ApproveDto
  ): Promise<ResponseDto<MessageDto>> {
    return { data: await this.activityService.approve(data) };
  }

  @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  @Post('reject')
  async rejectUser(@Body() data: ApproveDto): Promise<ResponseDto<MessageDto>> {
    return { data: await this.activityService.reject(data) };
  }
}
