import { Injectable, BadRequestException } from '@nestjs/common';
import { Activity } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

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
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil((await this.prisma.activity.count()) / limit),
      },
    };
  }

  async findOne(id: number): Promise<ResponseDto<Activity>> {
    return { data: await this.prisma.activity.findUnique({ where: { id } }) };
  }
}
