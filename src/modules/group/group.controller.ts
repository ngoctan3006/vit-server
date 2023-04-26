import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Group, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
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

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateGroupDto) {
    return this.groupService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupService.remove(id);
  }
}
