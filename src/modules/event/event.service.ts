import { Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async create(data: CreateEventDto): Promise<ResponseDto<Event>> {
    const { start_date, end_date, ...rest } = data;
    return {
      data: await this.prisma.event.create({
        data: {
          ...rest,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
        },
      }),
    };
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
