import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Activity, ActivityTime, UserJoinStatus } from '@prisma/client';
import * as moment from 'moment';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
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
    numberRequire: boolean;
    startTime: boolean;
    endTime: boolean;
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {
    this.selectTimes = {
      id: true,
      name: true,
      numberRequire: true,
      startTime: true,
      endTime: true,
    };
  }

  async checkActivityNotDeleted(id: string): Promise<boolean> {
    const count = await this.prisma.activity.count({
      where: { id, deletedAt: null },
    });
    if (count === 0)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return true;
  }

  async checkActivityDeleted(id: string): Promise<boolean> {
    const count = await this.prisma.activity.count({
      where: {
        id,
        deletedAt: { not: null },
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
    Activity & {
      times: Omit<ActivityTime, 'activityId'>[];
    }
  > {
    const { times, ...data } = createActivityDto;
    if (data.eventId) await this.eventService.findOne(data.eventId);
    let activityId: string;
    await this.prisma.$transaction(async (transactionClient) => {
      const activity = await transactionClient.activity.create({
        data,
        select: { id: true },
      });
      activityId = activity.id;
      await transactionClient.activityTime.createMany({
        data: times.map((time) => ({
          activityId,
          ...time,
        })),
      });
    });
    return await this.findOne(activityId);
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<
    ResponseDto<
      Array<
        Activity & {
          times: Omit<ActivityTime, 'activityId'>[];
        }
      >
    >
  > {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.activity.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          times: {
            select: this.selectTimes,
            orderBy: {
              startTime: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.activity.count({ where: { deletedAt: null } })) /
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
          times: Omit<ActivityTime, 'activityId'>[];
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
            deletedAt: null,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          times: {
            select: this.selectTimes,
            orderBy: { startTime: 'asc' },
          },
        },
        orderBy: { deletedAt: 'desc' },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.activity.count({
            where: {
              NOT: { deletedAt: null },
            },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: string): Promise<
    Activity & {
      times: Omit<ActivityTime, 'activityId'>[];
    }
  > {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        times: {
          select: this.selectTimes,
          orderBy: { startTime: 'asc' },
        },
      },
    });
    if (!activity || activity.deletedAt)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return activity;
  }

  async getMember(id: string): Promise<GetMemberResponseDto[]> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        times: {
          select: this.selectTimes,
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });
    if (!activity || activity.deletedAt)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );

    const activityMember: GetMemberResponseDto[] = [];
    for (const time of activity.times) {
      const member = await this.prisma.userActivity.findMany({
        where: { timeId: time.id },
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

    return activityMember;
  }

  async findOneDeleted(id: string): Promise<
    Activity & {
      times: Omit<ActivityTime, 'activityId'>[];
    }
  > {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        times: {
          select: this.selectTimes,
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });
    if (!activity || !activity.deletedAt)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return activity;
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto
  ): Promise<
    Activity & {
      times: Omit<ActivityTime, 'activityId'>[];
    }
  > {
    const activity = await this.findOne(id);
    const timesId = activity.times.map(({ id }) => id);
    const { times, ...data } = updateActivityDto;
    const timesIdToUpdate = times.map(({ id }) => id);

    await this.checkTimesInActivity(
      id,
      timesIdToUpdate.filter((id) => id !== '0')
    );
    await this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.activity.update({
        where: { id },
        data,
      });
      for (const time of times) {
        const { id: timeId, ...data } = time;
        if (timeId !== '0')
          await transactionClient.activityTime.update({
            where: { id: timeId },
            data,
          });
        else
          await transactionClient.activityTime.create({
            data: {
              activityId: id,
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

  async softDelete(id: string): Promise<MessageDto> {
    await this.checkActivityNotDeleted(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return messageSuccess.ACTIVITY_DELETE;
  }

  async restore(id: string): Promise<MessageDto> {
    await this.checkActivityDeleted(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deletedAt: null },
    });

    return messageSuccess.ACTIVITY_RESTORED;
  }

  async checkTimesInActivity(id: string, times: string[]): Promise<true> {
    const activity = await this.findOne(id);
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
    userId: string,
    data: RegistryActivityDto
  ): Promise<MessageDto> {
    const { timeId, activityId } = data;
    await this.userService.checkUserExisted(userId);
    const activity = await this.findOne(activityId);
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
        userId_timeId: { userId, timeId },
      },
    });
    if (registered) {
      if (
        registered.status === UserJoinStatus.REGISTERED ||
        registered.status === UserJoinStatus.ACCEPTED
      ) {
        throw new HttpException(
          httpErrors.ACTIVITY_REGISTERED,
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.prisma.userActivity.update({
          where: {
            userId_timeId: { userId, timeId },
          },
          data: {
            status: UserJoinStatus.REGISTERED,
          },
        });
      }
    } else {
      await this.prisma.userActivity.create({
        data: { userId, timeId, activityId },
      });
    }

    return messageSuccess.ACTIVITY_REGISTER;
  }

  async withdrawn(userId: string, timeId: string): Promise<MessageDto> {
    await this.userService.checkUserExisted(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        userId_timeId: { userId, timeId },
      },
    });
    if (!isRegistered || isRegistered.status === UserJoinStatus.WITHDRAWN)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    if (isRegistered.status === UserJoinStatus.REJECTED)
      throw new HttpException(
        httpErrors.ACTIVITY_REJECTED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userActivity.update({
      where: {
        userId_timeId: { userId, timeId },
      },
      data: { status: UserJoinStatus.WITHDRAWN },
    });

    return messageSuccess.ACTIVITY_WITHDRAWN;
  }

  async approve(data: ApproveDto): Promise<MessageDto> {
    const { timeId, userId } = data;
    await this.userService.checkUserExisted(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        userId_timeId: { userId, timeId },
      },
    });
    if (!isRegistered || isRegistered.status === UserJoinStatus.WITHDRAWN)
      throw new HttpException(
        httpErrors.ACTIVITY_USER_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    else if (isRegistered.status === UserJoinStatus.ACCEPTED)
      throw new HttpException(
        httpErrors.ACTIVITY_ACCEPTED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userActivity.update({
      where: {
        userId_timeId: { userId, timeId },
      },
      data: { status: UserJoinStatus.ACCEPTED },
    });

    return messageSuccess.ACTIVITY_APPROVE;
  }

  async reject(data: ApproveDto): Promise<MessageDto> {
    const { timeId, userId } = data;
    await this.userService.checkUserExisted(userId);
    const isRegistered = await this.prisma.userActivity.findUnique({
      where: {
        userId_timeId: { userId, timeId },
      },
    });
    if (!isRegistered || isRegistered.status === UserJoinStatus.WITHDRAWN)
      throw new HttpException(
        httpErrors.ACTIVITY_USER_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    else if (isRegistered.status === UserJoinStatus.REJECTED)
      throw new HttpException(
        httpErrors.ACTIVITY_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userActivity.update({
      where: {
        userId_timeId: { userId, timeId },
      },
      data: { status: UserJoinStatus.REJECTED },
    });

    return messageSuccess.ACTIVITY_REJECT;
  }

  async getTopMember() {
    const currentDate = moment();
    const startOfMonth = currentDate.startOf('month').toDate();
    const endOfMonth = currentDate.endOf('month').toDate();
    const topMember: TopMember[] = [];
    const activities = await this.prisma.activity.findMany({
      where: {
        deletedAt: null,
        deadline: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    const activitiesIds = activities.map((act) => act.id);
    for (const id of activitiesIds) {
      const activityMember = await this.getMember(id);
      for (const { member } of activityMember) {
        for (const mem of member) {
          const isExisted = topMember.findIndex((item) => item.id === mem.id);
          if (isExisted !== -1) {
            if (mem.status === UserJoinStatus.ACCEPTED) {
              topMember[isExisted].count += 1;
            }
          } else {
            if (mem.status === UserJoinStatus.ACCEPTED) {
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
