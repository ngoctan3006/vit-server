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
import { Roles } from 'src/shares/decorators/roles.decorator';
import { PaginationDto } from 'src/shares/dto/pagination.dto';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { ApproveDto } from './dto/approve.dto';

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
    return await this.eventService.create(data);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(
    @Query() pagination: PaginationDto
  ): Promise<ResponseDto<Event[]>> {
    return await this.eventService.findAll(pagination.page, pagination.limit);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Get('trash')
  async findAllDeleted(
    @Query() pagination: PaginationDto
  ): Promise<ResponseDto<Event[]>> {
    return await this.eventService.findAllDeleted(
      pagination.page,
      pagination.limit
    );
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseDto<Event>> {
    return await this.eventService.findOne(+id);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Get('trash/:id')
  async findOneDeleted(@Param('id') id: number): Promise<ResponseDto<Event>> {
    return await this.eventService.findOneDeleted(+id);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateEventDto
  ): Promise<ResponseDto<Event>> {
    return await this.eventService.update(+id, data);
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
    return await this.eventService.softDelete(+id);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Put('restore/:id')
  async restore(@Param('id') id: number): Promise<ResponseDto<Event>> {
    return await this.eventService.restore(+id);
  }

  @UseGuards(JwtGuard)
  @Put('register/:id')
  async register(
    @GetUser('id') userId: number,
    @Param('id') eventId: number
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.eventService.register(userId, +eventId);
  }

  @UseGuards(JwtGuard)
  @Put('cancel/:id')
  async cancelRegister(
    @GetUser('id') userId: number,
    @Param('id') eventId: number
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.eventService.cancelRegister(userId, +eventId);
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
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.eventService.approve(data);
  }
}
