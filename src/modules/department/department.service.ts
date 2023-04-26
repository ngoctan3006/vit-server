import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Department } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

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
      throw new BadRequestException('Invalid query params');

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
      throw new BadRequestException('Invalid query params');

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
      throw new NotFoundException('Department not found');
    }
    return { data: department };
  }

  async findOneDeleted(id: number): Promise<ResponseDto<Department>> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department || !department.deleted_at) {
      throw new NotFoundException('Department not found');
    }
    return { data: department };
  }

  async update(id: number, data: UpdateDepartmentDto): Promise<Department> {
    return await this.prisma.department.update({ where: { id }, data });
  }

  async softRemove(id: number): Promise<ResponseDto<{ message: string }>> {
    await this.prisma.department.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return {
      data: { message: 'Department has been deleted' },
    };
  }
}
