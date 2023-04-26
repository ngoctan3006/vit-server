import { Injectable } from '@nestjs/common';
import { Department } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDepartmentDto): Promise<Department> {
    return await this.prisma.department.create({ data });
  }

  async findAll(): Promise<Department[]> {
    return await this.prisma.department.findMany();
  }

  async findOne(id: number): Promise<Department> {
    return await this.prisma.department.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateDepartmentDto): Promise<Department> {
    return await this.prisma.department.update({ where: { id }, data });
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
