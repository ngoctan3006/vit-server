import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  create(@Body() data: CreateEventDto): Promise<ResponseDto<Event>> {
    return this.eventService.create(data);
  }

  // @UseGuards(JwtGuard)
  // @Get()
  // findAll(@Query() pagination: PaginationDto) {
  //   return this.eventService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventService.remove(+id);
  // }
}
