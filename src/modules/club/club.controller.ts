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
import { Club, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('club')
@ApiTags('club')
@ApiBearerAuth()
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Post()
  async create(@Body() data: CreateClubDto): Promise<ResponseDto<Club>> {
    return await this.clubService.create(data);
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
