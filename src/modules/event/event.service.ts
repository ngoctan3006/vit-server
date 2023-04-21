import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Event, UserActivityStatus } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApproveDto } from './dto/approve.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async create(data: CreateEventDto): Promise<ResponseDto<Event>> {
    const { start_date, end_date, ...rest } = data;
    return {
      data: await this.prisma.event.create({
        data: {
          ...rest,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
        },
      }),
    };
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Event[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.event.findMany({
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil((await this.prisma.event.count()) / limit),
      },
    };
  }

  async findAllDeleted(
    page: number,
    limit: number
  ): Promise<ResponseDto<Event[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.event.findMany({
        where: {
          NOT: {
            deleted_at: null,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil((await this.prisma.event.count()) / limit),
      },
    };
  }

  async findOne(id: number): Promise<ResponseDto<Event>> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event || event.deleted_at)
      throw new NotFoundException('Event not found');
    return { data: event };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Event>> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event || !event.deleted_at)
      throw new NotFoundException('Event not found');
    return { data: event };
  }

  async update(id: number, data: UpdateEventDto): Promise<ResponseDto<Event>> {
    const { start_date, end_date, ...rest } = data;
    const { data: event } = await this.findOne(id);

    await this.prisma.event.update({
      where: { id },
      data: {
        ...rest,
        start_date: start_date ? new Date(start_date) : event.start_date,
        end_date: end_date ? new Date(end_date) : event.end_date,
      },
    });

    return await this.findOne(id);
  }

  async softDelete(id: number): Promise<ResponseDto<{ message: string }>> {
    await this.findOne(id);
    await this.prisma.event.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return {
      data: {
        message: 'Delete activity successfully',
      },
    };
  }

  async restore(id: number): Promise<ResponseDto<Event>> {
    await this.findOneDeleted(id);
    await this.prisma.event.update({
      where: { id },
      data: { deleted_at: null },
    });

    return await this.findOne(id);
  }

  async register(
    userId: number,
    eventId: number
  ): Promise<ResponseDto<{ message: string }>> {
    await this.findOne(eventId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userEvent.findUnique({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
        },
      },
    });
    if (isRegistered) {
      if (isRegistered.status === UserActivityStatus.CANCLED)
        await this.prisma.userEvent.update({
          where: {
            user_id_event_id: {
              user_id: userId,
              event_id: eventId,
            },
          },
          data: {
            status: UserActivityStatus.REGISTERED,
          },
        });
      else throw new BadRequestException('You already registered');
    } else
      await this.prisma.userEvent.create({
        data: {
          user_id: userId,
          event_id: eventId,
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
    eventId: number
  ): Promise<ResponseDto<{ message: string }>> {
    await this.findOne(eventId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userEvent.findUnique({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
        },
      },
    });
    if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
      throw new BadRequestException('You have not registered yet');
    await this.prisma.userEvent.update({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
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
    const { eventId, userId } = data;
    await this.findOne(eventId);
    await this.userService.getUserInfoById(userId);
    const isRegistered = await this.prisma.userEvent.findUnique({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
        },
      },
    });
    if (!isRegistered || isRegistered.status === UserActivityStatus.CANCLED)
      throw new BadRequestException('User have not registered yet');
    else if (isRegistered.status === UserActivityStatus.ACCEPTED)
      throw new BadRequestException('User already accepted');
    await this.prisma.userEvent.update({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
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
