import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Activity, UserActivityStatus } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './../user/user.service';
import { ApproveDto, CreateActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async create(data: CreateActivityDto): Promise<ResponseDto<Activity>> {
    const { start_date, end_date, ...rest } = data;
    return {
      data: await this.prisma.activity.create({
        data: {
          ...rest,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
        },
      }),
    };
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Activity[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.activity.findMany({
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil((await this.prisma.activity.count()) / limit),
      },
    };
  }

  async findAllDeleted(
    page: number,
    limit: number
  ): Promise<ResponseDto<Activity[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.activity.findMany({
        where: {
          NOT: {
            deleted_at: null,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil((await this.prisma.activity.count()) / limit),
      },
    };
  }

  async findOne(id: number): Promise<ResponseDto<Activity>> {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity || activity.deleted_at)
      throw new NotFoundException('Activity not found');
    return { data: activity };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Activity>> {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity || !activity.deleted_at)
      throw new NotFoundException('Activity not found');
    return { data: activity };
  }

  async update(
    id: number,
    data: UpdateActivityDto
  ): Promise<ResponseDto<Activity>> {
    const { start_date, end_date, ...rest } = data;
    const { data: activity } = await this.findOne(id);

    await this.prisma.activity.update({
      where: { id },
      data: {
        ...rest,
        start_date: start_date ? new Date(start_date) : activity.start_date,
        end_date: end_date ? new Date(end_date) : activity.end_date,
      },
    });

    return await this.findOne(id);
  }

  async softDelete(id: number): Promise<ResponseDto<{ message: string }>> {
    await this.findOne(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return {
      data: {
        message: 'Delete activity successfully',
      },
    };
  }

  async restore(id: number): Promise<ResponseDto<Activity>> {
    await this.findOneDeleted(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deleted_at: null },
    });

    return await this.findOne(id);
  }

  async register(
    userId: number,
    activityId: number
  ): Promise<ResponseDto<{ message: string }>> {
    await this.findOne(activityId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        user_id_activity_id: {
          user_id: userId,
          activity_id: activityId,
        },
      },
    });
    if (isRegistered) {
      if (
        isRegistered.status === UserActivityStatus.REGISTERED ||
        isRegistered.status === UserActivityStatus.ACCEPTED
      )
        throw new BadRequestException('You already registered');
      else
        await this.prisma.userActivity.update({
          where: {
            user_id_activity_id: {
              user_id: userId,
              activity_id: activityId,
            },
          },
          data: {
            status: UserActivityStatus.REGISTERED,
          },
        });
    } else
      await this.prisma.userActivity.create({
        data: {
          user_id: userId,
          activity_id: activityId,
        },
      });

    return {
      data: {
        message: 'Register activity successfully',
      },
    };
  }

  async cancelRegister(
    userId: number,
    activityId: number
  ): Promise<ResponseDto<{ message: string }>> {
    await this.findOne(activityId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        user_id_activity_id: {
          user_id: userId,
          activity_id: activityId,
        },
      },
    });
    if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
      throw new BadRequestException('You have not registered yet');
    await this.prisma.userActivity.update({
      where: {
        user_id_activity_id: {
          user_id: userId,
          activity_id: activityId,
        },
      },
      data: {
        status: UserActivityStatus.CANCLED,
      },
    });

    return {
      data: {
        message: 'Cancel register activity successfully',
      },
    };
  }

  async approve(data: ApproveDto): Promise<ResponseDto<{ message: string }>> {
    const { activityId, userId } = data;
    await this.findOne(activityId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        user_id_activity_id: {
          user_id: userId,
          activity_id: activityId,
        },
      },
    });
    if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
      throw new BadRequestException('User have not registered yet');
    else if (isRegistered.status === UserActivityStatus.ACCEPTED)
      throw new BadRequestException('User already accepted');
    await this.prisma.userActivity.update({
      where: {
        user_id_activity_id: {
          user_id: userId,
          activity_id: activityId,
        },
      },
      data: {
        status: UserActivityStatus.ACCEPTED,
      },
    });

    return {
      data: {
        message: 'Accept register activity successfully',
      },
    };
  }
}
