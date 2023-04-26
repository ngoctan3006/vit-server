import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Department, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('department')
@ApiTags('department')
@ApiBearerAuth()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Post()
  async create(
    @Body() data: CreateDepartmentDto
  ): Promise<ResponseDto<Department>> {
    return await this.departmentService.create(data);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(): Promise<ResponseDto<Department[]>> {
    return await this.departmentService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto<Department>> {
    return this.departmentService.findOne(+id);
  }

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateDepartmentDto) {
    return await this.departmentService.update(+id, data);
  }

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Delete(':id')
  async softDelete(
    @Param('id') id: string
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.departmentService.softRemove(+id);
  }
}
