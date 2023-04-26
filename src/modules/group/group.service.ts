import { BadRequestException, Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

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

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, data: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
