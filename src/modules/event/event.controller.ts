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
import { Event, Position } from '@prisma/client';
import { GetUser, Roles } from 'src/shares/decorators';
import { MessageDto, PaginationDto, ResponseDto } from 'src/shares/dto';
import { JwtGuard } from '../auth/guards';
import { ApproveDto, CreateEventDto, UpdateEventDto } from './dto';
import { EventService } from './event.service';

@Controller('event')
@ApiTags('event')
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Post()
  async create(@Body() data: CreateEventDto): Promise<ResponseDto<Event>> {
    return { data: await this.eventService.create(data) };
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() { page, limit }: PaginationDto
  ): Promise<ResponseDto<Event[]>> {
    return await this.eventService.findAll(page, limit);
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
  ): Promise<ResponseDto<Event[]>> {
    return await this.eventService.findAllDeleted(page, limit);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto<Event>> {
    return { data: await this.eventService.findOne(id) };
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Get('trash/:id')
  async findOneDeleted(@Param('id') id: string): Promise<ResponseDto<Event>> {
    return { data: await this.eventService.findOneDeleted(id) };
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateEventDto
  ): Promise<ResponseDto<Event>> {
    return { data: await this.eventService.update(id, data) };
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<ResponseDto<MessageDto>> {
    return { data: await this.eventService.softDelete(id) };
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Put('restore/:id')
  async restore(@Param('id') id: string): Promise<ResponseDto<Event>> {
    return { data: await this.eventService.restore(id) };
  }

  @UseGuards(JwtGuard)
  @Put('register/:id')
  async register(
    @GetUser('id') userId: string,
    @Param('id') eventId: string
  ): Promise<ResponseDto<MessageDto>> {
    return { data: await this.eventService.register(userId, eventId) };
  }

  @UseGuards(JwtGuard)
  @Put('cancel/:id')
  async cancelRegister(
    @GetUser('id') userId: string,
    @Param('id') eventId: string
  ): Promise<ResponseDto<MessageDto>> {
    return { data: await this.eventService.cancelRegister(userId, eventId) };
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Post('approve')
  async approveUser(
    @Body() data: ApproveDto
  ): Promise<ResponseDto<MessageDto>> {
    return { data: await this.eventService.approve(data) };
  }
}
