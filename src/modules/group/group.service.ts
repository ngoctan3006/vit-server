import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService
  ) {}

  async create(data: CreateGroupDto): Promise<ResponseDto<Group>> {
    return { data: await this.prisma.group.create({ data }) };
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Group[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.group.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.group.count({
            where: { deletedAt: null },
          })) / limit
        ),
      },
    };
  }

  async findAllDeleted(
    page: number,
    limit: number
  ): Promise<ResponseDto<Group[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.group.findMany({
        where: { deletedAt: { not: null } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          deletedAt: 'desc',
        },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.group.count({
            where: { deletedAt: { not: null } },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });
    if (!group || group.deletedAt) {
      throw new HttpException(httpErrors.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return group;
  }

  async findOneDeleted(id: string): Promise<Group> {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });
    if (!group || !group.deletedAt) {
      throw new HttpException(httpErrors.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return group;
  }

  async update(id: string, data: UpdateGroupDto): Promise<Group> {
    await this.findOne(id);
    if (data.eventId) await this.eventService.findOne(data.eventId);
    return await this.prisma.group.update({ where: { id }, data });
  }

  async softRemove(id: string): Promise<MessageDto> {
    await this.findOne(id);
    await this.prisma.group.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return messageSuccess.GROUP_DELETE;
  }

  async restore(id: string): Promise<Group> {
    await this.findOneDeleted(id);
    await this.prisma.group.update({
      where: { id },
      data: { deletedAt: null },
    });
    return await this.findOne(id);
  }
}
