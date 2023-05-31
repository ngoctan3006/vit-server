import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Club } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { DepartmentService } from './../department/department.service';
import { PrismaService } from './../prisma/prisma.service';
import { CreateClubDto, UpdateClubDto } from './dto';

@Injectable()
export class ClubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly departmentService: DepartmentService
  ) {}

  async create(data: CreateClubDto): Promise<ResponseDto<Club>> {
    await this.departmentService.findOne(data.department_id);
    return { data: await this.prisma.club.create({ data }) };
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Club[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.club.findMany({
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.club.count({
            where: { deleted_at: null },
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
        where: { deleted_at: { not: null } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          deleted_at: 'desc',
        },
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.club.count({
            where: { deleted_at: { not: null } },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: number): Promise<ResponseDto<Club>> {
    const club = await this.prisma.club.findUnique({
      where: { id },
    });
    if (!club || club.deleted_at) {
      throw new HttpException(httpErrors.CLUB_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { data: club };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Club>> {
    const club = await this.prisma.club.findUnique({
      where: { id },
    });
    if (!club || !club.deleted_at) {
      throw new HttpException(httpErrors.CLUB_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { data: club };
  }

  async update(id: number, data: UpdateClubDto): Promise<ResponseDto<Club>> {
    await this.findOne(id);
    if (data.department_id)
      await this.departmentService.findOne(data.department_id);
    return { data: await this.prisma.club.update({ where: { id }, data }) };
  }

  async softRemove(id: number): Promise<ResponseDto<MessageDto>> {
    await this.findOne(id);
    await this.prisma.club.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { data: messageSuccess.CLUB_DELETE };
  }

  async restore(id: number): Promise<ResponseDto<Club>> {
    await this.findOneDeleted(id);
    await this.prisma.club.update({
      where: { id },
      data: { deleted_at: null },
    });
    return await this.findOne(id);
  }
}
