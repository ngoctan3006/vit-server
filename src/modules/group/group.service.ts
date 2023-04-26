import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Group } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from './../event/event.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

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
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.group.findMany({
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.group.count({
            where: { deleted_at: null },
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
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.group.findMany({
        where: { deleted_at: { not: null } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.group.count({
            where: { deleted_at: { not: null } },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: number): Promise<ResponseDto<Group>> {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });
    if (!group || group.deleted_at) {
      throw new NotFoundException('Group not found');
    }
    return { data: group };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Group>> {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });
    if (!group || !group.deleted_at) {
      throw new NotFoundException('Group not found');
    }
    return { data: group };
  }

  async update(id: number, data: UpdateGroupDto): Promise<Group> {
    await this.findOne(id);
    if (data.event_id) await this.eventService.findOne(data.event_id);
    return await this.prisma.group.update({ where: { id }, data });
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
