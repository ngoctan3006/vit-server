import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Department, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('department')
@ApiTags('department')
@ApiBearerAuth()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles(Position.ADMIN, Position.DOI_PHO, Position.TRUONG_HANH_CHINH)
  @Post()
  async create(@Body() data: CreateDepartmentDto): Promise<Department> {
    return await this.departmentService.create(data);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(): Promise<Department[]> {
    return await this.departmentService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ) {
    return this.departmentService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
