import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Activity, ActivityTime, UserActivityStatus } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './../user/user.service';
import {
  ApproveDto,
  CreateActivityDto,
  RegistryActivityDto,
  UpdateActivityDto,
} from './dto';

@Injectable()
export class ActivityService {
  private readonly selectTimes: {
    id: boolean;
    name: boolean;
    start_time: boolean;
    end_time: boolean;
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {
    this.selectTimes = {
      id: true,
      name: true,
      start_time: true,
      end_time: true,
    };
  }

  async checkActivityNotDeleted(id: number): Promise<boolean> {
    const count = await this.prisma.activity.count({
      where: { id, deleted_at: null },
    });
    if (count === 0)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return true;
  }

  async checkActivityDeleted(id: number): Promise<boolean> {
    const count = await this.prisma.activity.count({
      where: {
        id,
        deleted_at: {
          not: null,
        },
      },
    });
    if (count === 0)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return true;
  }

  async create(createActivityDto: CreateActivityDto): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    const { times, ...data } = createActivityDto;
    if (data.event_id) await this.eventService.findOne(data.event_id);
    let activity_id: number;
    await this.prisma.$transaction(async (transactionClient) => {
      const activity = await transactionClient.activity.create({
        data,
        select: {
          id: true,
        },
      });
      activity_id = activity.id;
      await transactionClient.activityTime.createMany({
        data: times.map((time) => ({
          activity_id,
          ...time,
        })),
      });
    });
    return await this.findOne(activity_id);
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<
    ResponseDto<
      Array<
        Activity & {
          times: Omit<ActivityTime, 'activity_id'>[];
        }
      >
    >
  > {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.activity.findMany({
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          times: {
            select: this.selectTimes,
            orderBy: {
              start_time: 'asc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.activity.count({ where: { deleted_at: null } })) /
            limit
        ),
      },
    };
  }

  async findAllDeleted(
    page: number,
    limit: number
  ): Promise<
    ResponseDto<
      Array<
        Activity & {
          times: Omit<ActivityTime, 'activity_id'>[];
        }
      >
    >
  > {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.activity.findMany({
        where: {
          NOT: {
            deleted_at: null,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          times: {
            select: this.selectTimes,
            orderBy: {
              start_time: 'asc',
            },
          },
        },
        orderBy: {
          deleted_at: 'desc',
        },
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.activity.count({
            where: {
              NOT: {
                deleted_at: null,
              },
            },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: number): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        times: {
          select: this.selectTimes,
          orderBy: {
            start_time: 'asc',
          },
        },
      },
    });
    if (!activity || activity.deleted_at)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return { data: activity };
  }

  async findOneDeleted(id: number): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        times: {
          select: this.selectTimes,
          orderBy: {
            start_time: 'asc',
          },
        },
      },
    });
    if (!activity || !activity.deleted_at)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return { data: activity };
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto
  ): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    const { times, ...data } = updateActivityDto;
    await this.checkTimesInActivity(
      id,
      times ? times.map((item) => item.id) : []
    );
    await this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.activity.update({
        where: { id },
        data,
      });
      if (times && times.length) {
        for (const time of times) {
          const { id, ...data } = time;
          await transactionClient.activityTime.update({
            where: { id },
            data,
          });
        }
      }
    });

    return await this.findOne(id);
  }

  async softDelete(id: number): Promise<ResponseDto<MessageDto>> {
    await this.checkActivityNotDeleted(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { data: messageSuccess.ACTIVITY_DELETE };
  }

  async restore(id: number): Promise<
    ResponseDto<
      Activity & {
        times: Omit<ActivityTime, 'activity_id'>[];
      }
    >
  > {
    await this.checkActivityDeleted(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deleted_at: null },
    });

    return await this.findOne(id);
  }

  async checkTimesInActivity(id: number, times: number[]): Promise<true> {
    const { data: activity } = await this.findOne(id);
    const timesId = activity.times.map(({ id }) => id);

    if (times.length === 0 || !times.every((item) => timesId.includes(item))) {
      throw new HttpException(
        httpErrors.ACTIVITY_TIME_NOT_VALID,
        HttpStatus.BAD_REQUEST
      );
    }
    return true;
  }

  async register(
    userId: number,
    data: RegistryActivityDto
  ): Promise<ResponseDto<MessageDto>> {
    const { timeId, activityId } = data;
    await this.userService.checkUserExisted(userId);
    const { data: activity } = await this.findOne(activityId);
    if (Date.now() > new Date(activity.deadline).getTime())
      throw new HttpException(
        httpErrors.ACTIVITY_EXPIRED,
        HttpStatus.BAD_REQUEST
      );
    if (!activity.times.some((item) => item.id === timeId))
      throw new HttpException(
        httpErrors.ACTIVITY_TIME_NOT_VALID,
        HttpStatus.BAD_REQUEST
      );
    const registered = await this.prisma.userActivity.findUnique({
      where: {
        user_id_time_id: {
          user_id: userId,
          time_id: timeId,
        },
      },
    });
    if (registered) {
      if (
        registered.status === UserActivityStatus.REGISTERED ||
        registered.status === UserActivityStatus.ACCEPTED
      ) {
        throw new HttpException(
          httpErrors.ACTIVITY_REGISTERED,
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.prisma.userActivity.update({
          where: {
            user_id_time_id: {
              user_id: userId,
              time_id: timeId,
            },
          },
          data: {
            status: UserActivityStatus.REGISTERED,
          },
        });
      }
    } else {
      await this.prisma.userActivity.create({
        data: { user_id: userId, time_id: timeId },
      });
    }

    return {
      data: messageSuccess.ACTIVITY_REGISTER,
    };
  }

  async cancelRegister(
    userId: number,
    timeId: number
  ): Promise<ResponseDto<MessageDto>> {
    await this.userService.checkUserExisted(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        user_id_time_id: {
          user_id: userId,
          time_id: timeId,
        },
      },
    });
    if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userActivity.update({
      where: {
        user_id_time_id: {
          user_id: userId,
          time_id: timeId,
        },
      },
      data: { status: UserActivityStatus.CANCLED },
    });

    return { data: messageSuccess.ACTIVITY_CANCEL };
  }

  async approve(data: ApproveDto): Promise<ResponseDto<MessageDto>> {
    const { timeId, userId } = data;
    await this.userService.checkUserExisted(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        user_id_time_id: {
          user_id: userId,
          time_id: timeId,
        },
      },
    });
    if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
      throw new HttpException(
        httpErrors.ACTIVITY_USER_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    else if (isRegistered.status === UserActivityStatus.ACCEPTED)
      throw new HttpException(
        httpErrors.ACTIVITY_ACCEPTED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userActivity.update({
      where: {
        user_id_time_id: {
          user_id: userId,
          time_id: timeId,
        },
      },
      data: { status: UserActivityStatus.ACCEPTED },
    });

    return { data: messageSuccess.ACTIVITY_APPROVE };
  }
}
