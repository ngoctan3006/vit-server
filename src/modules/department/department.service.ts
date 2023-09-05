import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Department } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDepartmentDto): Promise<ResponseDto<Department>> {
    return { data: await this.prisma.department.create({ data }) };
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<ResponseDto<Department[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.department.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.department.count({
            where: { deletedAt: null },
          })) / limit
        ),
      },
    };
  }

  async findAllDeleted(
    page: number,
    limit: number
  ): Promise<ResponseDto<Department[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    return {
      data: await this.prisma.department.findMany({
        where: { deletedAt: { not: null } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          deletedAt: 'desc',
        },
      }),
      pagination: {
        totalPage: Math.ceil(
          (await this.prisma.department.count({
            where: { deletedAt: { not: null } },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: string): Promise<ResponseDto<Department>> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department || department.deletedAt) {
      throw new HttpException(
        httpErrors.DEPARTMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }
    return { data: department };
  }

  async findOneDeleted(id: string): Promise<ResponseDto<Department>> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department || !department.deletedAt) {
      throw new HttpException(
        httpErrors.DEPARTMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }
    return { data: department };
  }

  async update(id: string, data: UpdateDepartmentDto): Promise<Department> {
    await this.findOne(id);
    return await this.prisma.department.update({ where: { id }, data });
  }

  async softRemove(id: string): Promise<ResponseDto<MessageDto>> {
    await this.findOne(id);
    await this.prisma.department.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { data: messageSuccess.DEPARTMENT_DELETE };
  }

  async restore(id: string): Promise<ResponseDto<Department>> {
    await this.findOneDeleted(id);
    await this.prisma.department.update({
      where: { id },
      data: { deletedAt: null },
    });

    return await this.findOne(id);
  }
}
