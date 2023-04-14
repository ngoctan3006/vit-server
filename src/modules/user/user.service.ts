import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hashPassword } from 'src/shares/utils/password.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hashPassword(createUserDto.password),
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async checkUserExists(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        username,
      },
    });
    return count > 0;
  }
}
