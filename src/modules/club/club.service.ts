import { Injectable } from '@nestjs/common';
import { Club } from '@prisma/client';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { PrismaService } from './../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClubDto): Promise<ResponseDto<Club>> {
    return { data: await this.prisma.club.create({ data }) };
  }

  findAll() {
    return `This action returns all club`;
  }

  findOne(id: number) {
    return `This action returns a #${id} club`;
  }

  update(id: number, data: UpdateClubDto) {
    return `This action updates a #${id} club`;
  }

  remove(id: number) {
    return `This action removes a #${id} club`;
  }
}
