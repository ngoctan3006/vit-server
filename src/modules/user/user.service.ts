import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hashPassword } from 'src/shares/utils/password.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, date_join, date_out, ...userData } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userData,
        password: await hashPassword(password),
        date_join: new Date(date_join),
        date_out: date_out ? new Date(date_out) : null,
        birthday: new Date(userData.birthday),
        email: userData.email?.toLowerCase(),
        phone: userData.phone?.split(' ').join(''),
      },
    });
  }

  async createMany(createUserDtos: CreateUserDto[]) {
    const newUser = await this.prisma.user.createMany({
      data: await Promise.all(
        createUserDtos.map(
          async ({ password, date_join, date_out, ...userData }) => ({
            ...userData,
            password: await hashPassword(password),
            date_join: new Date(date_join),
            date_out: date_out ? new Date(date_out) : null,
          })
        )
      ),
    });

    return newUser;
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

  async getAllUsername() {
    return await this.prisma.user.findMany({
      select: {
        username: true,
      },
    });
  }
}
