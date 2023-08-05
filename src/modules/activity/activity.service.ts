import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Activity, ActivityTime, UserActivityStatus } from '@prisma/client';
import * as moment from 'moment';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './../user/user.service';
import {
  ApproveDto,
  CreateActivityDto,
  GetMemberResponseDto,
  RegistryActivityDto,
  TopMember,
  UpdateActivityDto,
} from './dto';

@Injectable()
export class ActivityService {
  private readonly selectTimes: {
    id: boolean;
    name: boolean;
    number_require: boolean;
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
      number_require: true,
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

  async getMember(id: number): Promise<ResponseDto<GetMemberResponseDto[]>> {
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

    const activityMember: GetMemberResponseDto[] = [];
    for (const time of activity.times) {
      const member = await this.prisma.userActivity.findMany({
        where: { time_id: time.id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullname: true,
              avatar: true,
            },
          },
        },
      });
      activityMember.push({
        id: time.id,
        name: time.name,
        member: member.map((item) => ({
          ...item.user,
          status: item.status,
        })),
      });
    }

    return { data: activityMember };
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
    const { data: activity } = await this.findOne(id);
    const timesId = activity.times.map(({ id }) => id);
    const { times, ...data } = updateActivityDto;
    const timesIdToUpdate = times.map(({ id }) => id);

    await this.checkTimesInActivity(
      id,
      timesIdToUpdate.filter((id) => id !== 0)
    );
    await this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.activity.update({
        where: { id },
        data,
      });
      for (const time of times) {
        const { id: timeId, ...data } = time;
        if (timeId !== 0)
          await transactionClient.activityTime.update({
            where: { id: timeId },
            data,
          });
        else
          await transactionClient.activityTime.create({
            data: {
              activity_id: id,
              ...data,
            },
          });
      }
      for (const timeId of timesId) {
        if (!timesIdToUpdate.includes(timeId))
          await transactionClient.activityTime.delete({
            where: { id: timeId },
          });
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

  async restore(id: number): Promise<ResponseDto<MessageDto>> {
    await this.checkActivityDeleted(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deleted_at: null },
    });

    return {
      data: messageSuccess.ACTIVITY_RESTORED,
    };
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

  async withdrawn(
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
    if (!isRegistered || isRegistered.status === UserActivityStatus.WITHDRAWN)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    if (isRegistered.status === UserActivityStatus.REJECTED)
      throw new HttpException(
        httpErrors.ACTIVITY_REJECTED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userActivity.update({
      where: {
        user_id_time_id: {
          user_id: userId,
          time_id: timeId,
        },
      },
      data: { status: UserActivityStatus.WITHDRAWN },
    });

    return { data: messageSuccess.ACTIVITY_WITHDRAWN };
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
    if (!isRegistered || isRegistered.status === UserActivityStatus.WITHDRAWN)
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

  async reject(data: ApproveDto): Promise<ResponseDto<MessageDto>> {
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
    if (!isRegistered || isRegistered.status === UserActivityStatus.WITHDRAWN)
      throw new HttpException(
        httpErrors.ACTIVITY_USER_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    else if (isRegistered.status === UserActivityStatus.REJECTED)
      throw new HttpException(
        httpErrors.ACTIVITY_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userActivity.update({
      where: {
        user_id_time_id: {
          user_id: userId,
          time_id: timeId,
        },
      },
      data: { status: UserActivityStatus.REJECTED },
    });

    return { data: messageSuccess.ACTIVITY_REJECT };
  }

  async getTopMember() {
    const currentDate = moment();
    const startOfMonth = currentDate.startOf('month').toDate();
    const endOfMonth = currentDate.endOf('month').toDate();
    const topMember: TopMember[] = [];
    const activities = await this.prisma.activity.findMany({
      where: {
        deleted_at: null,
        deadline: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    const activitiesIds = activities.map((act) => act.id);
    for (const id of activitiesIds) {
      const { data: activityMember } = await this.getMember(id);
      for (const { member } of activityMember) {
        for (const mem of member) {
          const isExisted = topMember.findIndex((item) => item.id === mem.id);
          if (isExisted !== -1) {
            if (mem.status === UserActivityStatus.ACCEPTED) {
              topMember[isExisted].count += 1;
            }
          } else {
            if (mem.status === UserActivityStatus.ACCEPTED) {
              delete mem.status;
              topMember.push({
                ...mem,
                count: 1,
              });
            }
          }
        }
      }
    }
    return topMember.sort((a, b) => b.count - a.count).slice(0, 6);
  }
}
