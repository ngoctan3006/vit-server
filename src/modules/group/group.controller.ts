import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Group, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators';
import { PaginationDto, ResponseDto } from 'src/shares/dto';
import { JwtGuard } from '../auth/guards';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { GroupService } from './group.service';

@Controller('group')
@ApiTags('group')
@ApiBearerAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Post()
  async create(@Body() data: CreateGroupDto): Promise<ResponseDto<Group>> {
    return await this.groupService.create(data);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() { page, limit }: PaginationDto
  ): Promise<ResponseDto<Group[]>> {
    return await this.groupService.findAll(page, limit);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Get('trash')
  async findAllDeleted(
    @Query() { page, limit }: PaginationDto
  ): Promise<ResponseDto<Group[]>> {
    return await this.groupService.findAllDeleted(page, limit);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseDto<Group>> {
    return await this.groupService.findOne(id);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Get('trash/:id')
  async findOneDeleted(@Param('id') id: number): Promise<ResponseDto<Group>> {
    return await this.groupService.findOneDeleted(id);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: UpdateGroupDto) {
    return await this.groupService.update(id, data);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Delete(':id')
  async softDelete(
    @Param('id') id: number
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.groupService.softRemove(id);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Put('restore/:id')
  async restore(@Param('id') id: number): Promise<ResponseDto<Group>> {
    return await this.groupService.restore(id);
  }
}
