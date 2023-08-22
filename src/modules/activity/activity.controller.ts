import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';

@Controller('activity')
@ApiTags('activity')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // @UseGuards(JwtGuard)
  // @Get()
  // async findAll(@Query() pagination: PaginationDto): Promise<
  //   ResponseDto<
  //     Array<
  //       Activity & {
  //         times: Omit<ActivityTime, 'activity_id'>[];
  //       }
  //     >
  //   >
  // > {
  //   return await this.activityService.findAll(
  //     pagination.page,
  //     pagination.limit
  //   );
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Get('trash')
  // async findAllDeleted(@Query() pagination: PaginationDto): Promise<
  //   ResponseDto<
  //     Array<
  //       Activity & {
  //         times: Omit<ActivityTime, 'activity_id'>[];
  //       }
  //     >
  //   >
  // > {
  //   return await this.activityService.findAllDeleted(
  //     pagination.page,
  //     pagination.limit
  //   );
  // }

  // @UseGuards(JwtGuard)
  // @Get('top-member')
  // async getTopMember(): Promise<ResponseDto<TopMember[]>> {
  //   return { data: await this.activityService.getTopMember() };
  // }

  // @UseGuards(JwtGuard)
  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<
  //   ResponseDto<
  //     Activity & {
  //       times: Omit<ActivityTime, 'activity_id'>[];
  //     }
  //   >
  // > {
  //   return await this.activityService.findOne(+id);
  // }

  // @UseGuards(JwtGuard)
  // @Get('member/:id')
  // async getMember(
  //   @Param('id') id: number
  // ): Promise<ResponseDto<GetMemberResponseDto[]>> {
  //   return await this.activityService.getMember(+id);
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Get('trash/:id')
  // async findOneDeleted(@Param('id') id: number): Promise<
  //   ResponseDto<
  //     Activity & {
  //       times: Omit<ActivityTime, 'activity_id'>[];
  //     }
  //   >
  // > {
  //   return await this.activityService.findOneDeleted(+id);
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Post()
  // async create(@Body() data: CreateActivityDto): Promise<
  //   ResponseDto<
  //     Activity & {
  //       times: Omit<ActivityTime, 'activity_id'>[];
  //     }
  //   >
  // > {
  //   return await this.activityService.create(data);
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() data: UpdateActivityDto
  // ): Promise<
  //   ResponseDto<
  //     Activity & {
  //       times: Omit<ActivityTime, 'activity_id'>[];
  //     }
  //   >
  // > {
  //   return await this.activityService.update(+id, data);
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Delete(':id')
  // async softDelete(@Param('id') id: number): Promise<ResponseDto<MessageDto>> {
  //   return await this.activityService.softDelete(+id);
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Put('restore/:id')
  // async restore(@Param('id') id: number): Promise<ResponseDto<MessageDto>> {
  //   return await this.activityService.restore(+id);
  // }

  // @UseGuards(JwtGuard)
  // @Post('register')
  // async register(
  //   @GetUser('id') userId: number,
  //   @Body() data: RegistryActivityDto
  // ): Promise<ResponseDto<MessageDto>> {
  //   return await this.activityService.register(userId, data);
  // }

  // @UseGuards(JwtGuard)
  // @Put('withdrawn/:id')
  // async withdrawn(
  //   @GetUser('id') userId: number,
  //   @Param('id') timeId: number
  // ): Promise<ResponseDto<MessageDto>> {
  //   return await this.activityService.withdrawn(userId, +timeId);
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Post('approve')
  // async approveUser(
  //   @Body() data: ApproveDto
  // ): Promise<ResponseDto<MessageDto>> {
  //   return await this.activityService.approve(data);
  // }

  // @Roles(Position.ADMIN, Position.TRUONG_HANH_CHINH)
  // @Post('reject')
  // async rejectUser(@Body() data: ApproveDto): Promise<ResponseDto<MessageDto>> {
  //   return await this.activityService.reject(data);
  // }
}
