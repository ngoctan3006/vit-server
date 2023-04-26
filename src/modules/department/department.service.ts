import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ResponseDto } from 'src/shares/dto/response.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDepartmentDto): Promise<ResponseDto<Department>> {
    return { data: await this.prisma.department.create({ data }) };
  }

  async findAll(): Promise<ResponseDto<Department[]>> {
    return {
      data: await this.prisma.department.findMany({
        where: { deleted_at: null },
      }),
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
