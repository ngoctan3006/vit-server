import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';

@Controller('department')
@ApiTags('department')
@ApiBearerAuth()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  // @Post()
  // async create(
  //   @Body() data: CreateDepartmentDto
  // ): Promise<ResponseDto<Department>> {
  //   return await this.departmentService.create(data);
  // }

  // @UseGuards(JwtGuard)
  // @Get()
  // async findAll(
  //   @Query() { page, limit }: PaginationDto
  // ): Promise<ResponseDto<Department[]>> {
  //   return await this.departmentService.findAll(page, limit);
  // }

  // @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  // @Get('trash')
  // async findAllDeleted(
  //   @Query() { page, limit }: PaginationDto
  // ): Promise<ResponseDto<Department[]>> {
  //   return await this.departmentService.findAllDeleted(page, limit);
  // }

  // @UseGuards(JwtGuard)
  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<ResponseDto<Department>> {
  //   return await this.departmentService.findOne(id);
  // }

  // @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  // @Get('trash/:id')
  // async findOneDeleted(
  //   @Param('id') id: number
  // ): Promise<ResponseDto<Department>> {
  //   return await this.departmentService.findOneDeleted(id);
  // }

  // @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  // @Put(':id')
  // async update(@Param('id') id: number, @Body() data: UpdateDepartmentDto) {
  //   return await this.departmentService.update(id, data);
  // }

  // @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  // @Delete(':id')
  // async softDelete(@Param('id') id: number): Promise<ResponseDto<MessageDto>> {
  //   return await this.departmentService.softRemove(id);
  // }

  // @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  // @Put('restore/:id')
  // async restore(@Param('id') id: number): Promise<ResponseDto<Department>> {
  //   return await this.departmentService.restore(id);
  // }
}
