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
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';

@Controller('group')
@ApiTags('group')
@ApiBearerAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() data: CreateGroupDto) {
    return this.groupService.create(data);
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
