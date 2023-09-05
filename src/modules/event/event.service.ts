import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event, UserJoinStatus } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ApproveDto, CreateEventDto, UpdateEventDto } from './dto';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async create(data: CreateEventDto): Promise<Event> {
    return await this.prisma.event.create({ data });
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Event[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.event.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.event.count({ where: { deletedAt: null } })) /
            limit
        ),
      },
    };
  }

  async findAllDeleted(
    page: number,
    limit: number
  ): Promise<ResponseDto<Event[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.event.findMany({
        where: {
          deletedAt: { not: null },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { deletedAt: 'desc' },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.event.count({
            where: { deletedAt: { not: null } },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event || event.deletedAt)
      throw new HttpException(httpErrors.EVENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    return event;
  }

  async findOneDeleted(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event || !event.deletedAt)
      throw new HttpException(httpErrors.EVENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    return event;
  }

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    await this.findOne(id);
    const event = await this.findOne(id);

    await this.prisma.event.update({
      where: { id },
      data,
    });

    return await this.findOne(id);
  }

  async softDelete(id: string): Promise<MessageDto> {
    await this.findOne(id);
    await this.prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return messageSuccess.EVENT_DELETE;
  }

  async restore(id: string): Promise<Event> {
    await this.findOneDeleted(id);
    await this.prisma.event.update({
      where: { id },
      data: { deletedAt: null },
    });

    return await this.findOne(id);
  }

  async register(userId: string, eventId: string): Promise<MessageDto> {
    await this.findOne(eventId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userEvent.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    if (isRegistered) {
      if (isRegistered.status === UserJoinStatus.WITHDRAWN)
        await this.prisma.userEvent.update({
          where: {
            userId_eventId: { userId, eventId },
          },
          data: { status: UserJoinStatus.REGISTERED },
        });
      else
        throw new HttpException(
          httpErrors.EVENT_REGISTERED,
          HttpStatus.BAD_REQUEST
        );
    } else
      await this.prisma.userEvent.create({
        data: { userId, eventId },
      });

    return messageSuccess.EVENT_REGISTER;
  }

  async cancelRegister(userId: string, eventId: string): Promise<MessageDto> {
    await this.findOne(eventId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userEvent.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    if (!isRegistered || isRegistered.status === UserJoinStatus.WITHDRAWN)
      throw new HttpException(
        httpErrors.EVENT_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userEvent.update({
      where: {
        userId_eventId: { userId, eventId },
      },
      data: { status: UserJoinStatus.WITHDRAWN },
    });

    return messageSuccess.EVENT_CANCEL;
  }

  async approve(data: ApproveDto): Promise<MessageDto> {
    const { eventId, userId } = data;
    await this.findOne(eventId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userEvent.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    if (!isRegistered || isRegistered.status === UserJoinStatus.WITHDRAWN)
      throw new HttpException(
        httpErrors.EVENT_USER_NOT_REGISTERED,
        HttpStatus.BAD_REQUEST
      );
    else if (isRegistered.status === UserJoinStatus.ACCEPTED)
      throw new HttpException(
        httpErrors.EVENT_ACCEPTED,
        HttpStatus.BAD_REQUEST
      );
    await this.prisma.userEvent.update({
      where: {
        userId_eventId: { userId, eventId },
      },
      data: { status: UserJoinStatus.ACCEPTED },
    });

    return messageSuccess.EVENT_APPROVE;
  }
}
