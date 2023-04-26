import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('club')
@ApiTags('club')
@ApiBearerAuth()
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  create(@Body() data: CreateClubDto) {
    return this.clubService.create(data);
  }

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clubService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: UpdateClubDto) {
    return this.clubService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clubService.remove(id);
  }
}
