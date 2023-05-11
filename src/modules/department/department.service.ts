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
        where: { deleted_at: null },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.department.count({
            where: { deleted_at: null },
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
        where: { deleted_at: { not: null } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        totalPage: Math.ceil(
          (await this.prisma.department.count({
            where: { deleted_at: { not: null } },
          })) / limit
        ),
      },
    };
  }

  async findOne(id: number): Promise<ResponseDto<Department>> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department || department.deleted_at) {
      throw new HttpException(
        httpErrors.DEPARTMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }
    return { data: department };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Department>> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department || !department.deleted_at) {
      throw new HttpException(
        httpErrors.DEPARTMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }
    return { data: department };
  }

  async update(id: number, data: UpdateDepartmentDto): Promise<Department> {
    await this.findOne(id);
    return await this.prisma.department.update({ where: { id }, data });
  }

  async softRemove(id: number): Promise<ResponseDto<MessageDto>> {
    await this.findOne(id);
    await this.prisma.department.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { data: messageSuccess.DEPARTMENT_DELETE };
  }

  async restore(id: number): Promise<ResponseDto<Department>> {
    await this.findOneDeleted(id);
    await this.prisma.department.update({
      where: { id },
      data: { deleted_at: null },
    });

    return await this.findOne(id);
  }
}
