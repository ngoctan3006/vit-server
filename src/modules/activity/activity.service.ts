import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Activity } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './../user/user.service';
import { CreateActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    const { times, ...data } = createActivityDto;
    if (createActivityDto.event_id)
      await this.eventService.findOne(createActivityDto.event_id);
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
          activity_id: activity.id,
          ...time,
        })),
      });
    });
    return await this.findOne(activity_id);
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Activity[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.activity.findMany({
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          times: true,
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
  ): Promise<ResponseDto<Activity[]>> {
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
          times: true,
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

  async findOne(id: number): Promise<ResponseDto<Activity>> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        times: true,
      },
    });
    if (!activity || activity.deleted_at)
      throw new HttpException(
        httpErrors.ACTIVITY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    return { data: activity };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Activity>> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        times: true,
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
    data: UpdateActivityDto
  ): Promise<ResponseDto<Activity>> {
    const { times, deadline, ...rest } = data;
    const { data: activity } = await this.findOne(id);
    await this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.activity.update({
        where: { id },
        data: {
          ...rest,
          deadline: deadline ? new Date(deadline) : activity.deadline,
        },
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
    await this.findOne(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { data: messageSuccess.ACTIVITY_DELETE };
  }

  async restore(id: number): Promise<ResponseDto<Activity>> {
    await this.findOneDeleted(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deleted_at: null },
    });

    return await this.findOne(id);
  }

  // async register(
  //   userId: number,
  //   activityId: number
  // ): Promise<ResponseDto<MessageDto>> {
  //   await this.findOne(activityId);
  //   await this.userService.getUserInfoById(userId);
  //   const isRegistered = await this.prisma.userActivity.findUnique({
  //     where: {
  //       user_id_activity_id: {
  //         user_id: userId,
  //         activity_id: activityId,
  //       },
  //     },
  //   });
  //   if (isRegistered) {
  //     if (
  //       isRegistered.status === UserActivityStatus.REGISTERED ||
  //       isRegistered.status === UserActivityStatus.ACCEPTED
  //     )
  //       throw new HttpException(
  //         httpErrors.ACTIVITY_REGISTERED,
  //         HttpStatus.BAD_REQUEST
  //       );
  //     else
  //       await this.prisma.userActivity.update({
  //         where: {
  //           user_id_activity_id: {
  //             user_id: userId,
  //             activity_id: activityId,
  //           },
  //         },
  //         data: { status: UserActivityStatus.REGISTERED },
  //       });
  //   } else
  //     await this.prisma.userActivity.create({
  //       data: {
  //         user_id: userId,
  //         activity_id: activityId,
  //       },
  //     });

  //   return { data: messageSuccess.ACTIVITY_REGISTER };
  // }

  // async cancelRegister(
  //   userId: number,
  //   activityId: number
  // ): Promise<ResponseDto<MessageDto>> {
  //   await this.findOne(activityId);
  //   await this.userService.getUserInfoById(userId);
  //   const isRegistered = await this.prisma.userActivity.findUnique({
  //     where: {
  //       user_id_activity_id: {
  //         user_id: userId,
  //         activity_id: activityId,
  //       },
  //     },
  //   });
  //   if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
  //     throw new HttpException(
  //       httpErrors.ACTIVITY_NOT_REGISTERED,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   await this.prisma.userActivity.update({
  //     where: {
  //       user_id_activity_id: {
  //         user_id: userId,
  //         activity_id: activityId,
  //       },
  //     },
  //     data: { status: UserActivityStatus.CANCLED },
  //   });

  //   return { data: messageSuccess.ACTIVITY_CANCEL };
  // }

  // async approve(data: ApproveDto): Promise<ResponseDto<MessageDto>> {
  //   const { activityId, userId } = data;
  //   await this.findOne(activityId);
  //   await this.userService.getUserInfoById(userId);
  //   const isRegistered = await this.prisma.userActivity.findUnique({
  //     where: {
  //       user_id_activity_id: {
  //         user_id: userId,
  //         activity_id: activityId,
  //       },
  //     },
  //   });
  //   if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
  //     throw new HttpException(
  //       httpErrors.ACTIVITY_USER_NOT_REGISTERED,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   else if (isRegistered.status === UserActivityStatus.ACCEPTED)
  //     throw new HttpException(
  //       httpErrors.ACTIVITY_ACCEPTED,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   await this.prisma.userActivity.update({
  //     where: {
  //       user_id_activity_id: {
  //         user_id: userId,
  //         activity_id: activityId,
  //       },
  //     },
  //     data: { status: UserActivityStatus.ACCEPTED },
  //   });

  //   return { data: messageSuccess.ACTIVITY_APPROVE };
  // }
}
