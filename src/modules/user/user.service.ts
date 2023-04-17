import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { hashPassword } from 'src/shares/utils/password.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, birthday, date_join, date_out, ...userData } =
      createUserDto;

    return await this.prisma.user.create({
      data: {
        ...userData,
        password: await hashPassword(password),
        date_join: new Date(date_join),
        date_out: date_out ? new Date(date_out) : null,
        birthday: birthday ? new Date(birthday) : null,
        email: userData.email?.toLowerCase(),
        phone: userData.phone?.split(' ').join(''),
      },
    });
  }

  async createMany(createUserDtos: CreateUserDto[]) {
    return await this.prisma.user.createMany({
      data: await Promise.all(
        createUserDtos.map(
          async ({
            email,
            phone,
            birthday,
            password,
            date_join,
            date_out,
            ...userData
          }) => ({
            ...userData,
            password: await hashPassword(password),
            date_join: new Date(date_join),
            date_out: date_out ? new Date(date_out) : null,
            birthday: birthday ? new Date(birthday) : null,
            email: email?.toLowerCase(),
            phone: phone?.split(' ').join(''),
          })
        )
      ),
    });
  }

  async getUserInfoById(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    delete user.password;
    return user;
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