import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Club } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { DepartmentService } from './../department/department.service';
import { PrismaService } from './../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly departmentService: DepartmentService
  ) {}

  async create(data: CreateClubDto): Promise<ResponseDto<Club>> {
    await this.departmentService.findOne(data.deparment_id);
    return { data: await this.prisma.club.create({ data }) };
  }

  async findAll(page: number, limit: number): Promise<ResponseDto<Club[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.club.findMany({
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
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
      throw new BadRequestException('Invalid query params');

    return {
      data: await this.prisma.club.findMany({
        where: { deleted_at: { not: null } },
        skip: (page - 1) * limit,
        take: limit,
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
      throw new NotFoundException('Club not found');
    }
    return { data: club };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Club>> {
    const club = await this.prisma.club.findUnique({
      where: { id },
    });
    if (!club || !club.deleted_at) {
      throw new NotFoundException('Club not found');
    }
    return { data: club };
  }

  async update(id: number, data: UpdateClubDto): Promise<ResponseDto<Club>> {
    await this.findOne(id);
    if (data.deparment_id)
      await this.departmentService.findOne(data.deparment_id);
    return { data: await this.prisma.club.update({ where: { id }, data }) };
  }

  async softRemove(id: number): Promise<ResponseDto<{ message: string }>> {
    await this.findOne(id);
    await this.prisma.club.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return {
      data: { message: 'Club has been deleted' },
    };
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
