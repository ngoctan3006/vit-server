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
import { Club, Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators';
import { MessageDto, PaginationDto, ResponseDto } from 'src/shares/dto';
import { JwtGuard } from '../auth/guards';
import { ClubService } from './club.service';
import { CreateClubDto, UpdateClubDto } from './dto';

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

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() { page, limit }: PaginationDto
  ): Promise<ResponseDto<Club[]>> {
    return await this.clubService.findAll(page, limit);
  }

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Get('trash')
  async findAllDeleted(
    @Query() { page, limit }: PaginationDto
  ): Promise<ResponseDto<Club[]>> {
    return await this.clubService.findAllDeleted(page, limit);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseDto<Club>> {
    return await this.clubService.findOne(id);
  }

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Get('trash/:id')
  async findOneDeleted(@Param('id') id: number): Promise<ResponseDto<Club>> {
    return await this.clubService.findOneDeleted(id);
  }

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: UpdateClubDto) {
    return await this.clubService.update(id, data);
  }

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Delete(':id')
  async softDelete(@Param('id') id: number): Promise<ResponseDto<MessageDto>> {
    return await this.clubService.softRemove(id);
  }

  @Roles(Position.ADMIN, Position.DOI_TRUONG, Position.DOI_PHO)
  @Put('restore/:id')
  async restore(@Param('id') id: number): Promise<ResponseDto<Club>> {
    return await this.clubService.restore(id);
  }
}
