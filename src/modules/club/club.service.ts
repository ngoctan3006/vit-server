import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Club } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { DepartmentService } from '../department/department.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClubDto, UpdateClubDto } from './dto';

@Injectable()
export class ClubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly departmentService: DepartmentService
  ) {}

  async create(data: CreateClubDto): Promise<ResponseDto<Club>> {
    await this.departmentService.findOne(data.departmentId);
    return { data: await this.prisma.club.create({ data }) };
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Club[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.club.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.club.count({
            where: { deletedAt: null },
          })) / limit
        ),
      },
    };
  }

  async findAllDeleted(
    page: number,
    limit: number
  ): Promise<ResponseDto<Club[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.club.findMany({
        where: { deletedAt: { not: null } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          deletedAt: 'desc',
        },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.club.count({
            where: { deletedAt: { not: null } },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: string): Promise<ResponseDto<Club>> {
    const club = await this.prisma.club.findUnique({
      where: { id },
    });
    if (!club || club.deletedAt) {
      throw new HttpException(httpErrors.CLUB_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { data: club };
  }

  async findOneDeleted(id: string): Promise<ResponseDto<Club>> {
    const club = await this.prisma.club.findUnique({
      where: { id },
    });
    if (!club || !club.deletedAt) {
      throw new HttpException(httpErrors.CLUB_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { data: club };
  }

  async update(id: string, data: UpdateClubDto): Promise<ResponseDto<Club>> {
    await this.findOne(id);
    if (data.departmentId)
      await this.departmentService.findOne(data.departmentId);
    return { data: await this.prisma.club.update({ where: { id }, data }) };
  }

  async softRemove(id: string): Promise<ResponseDto<MessageDto>> {
    await this.findOne(id);
    await this.prisma.club.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { data: messageSuccess.CLUB_DELETE };
  }

  async restore(id: string): Promise<ResponseDto<Club>> {
    await this.findOneDeleted(id);
    await this.prisma.club.update({
      where: { id },
      data: { deletedAt: null },
    });
    return await this.findOne(id);
  }
}
