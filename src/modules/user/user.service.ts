import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Queue } from 'bull';
import { hashPassword } from 'src/shares/utils/password.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('send-mail') private readonly sendMail: Queue
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, birthday, date_join, date_out, ...userData } =
      createUserDto;

    try {
      const user = await this.prisma.user.create({
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

      await this.sendMail.add(
        'welcome',
        {
          email: user.email,
          name: user.fullname,
          username: user.username,
          password,
        },
        {
          removeOnComplete: true,
        }
      );

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async createMany(createUserDtos: CreateUserDto[]) {
    const data = await Promise.all(
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
    );
    const res = await this.prisma.user.createMany({
      data,
    });

    for (const user of createUserDtos) {
      await this.sendMail.add(
        'welcome',
        {
          email: user.email?.toLowerCase(),
          name: user.fullname,
          username: user.username,
          password: user.password,
        },
        {
          removeOnComplete: true,
        }
      );
    }

    return res;
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

  async checkUserExists(
    username: string,
    email: string,
    phone: string
  ): Promise<string | boolean> {
    const usernameExist = await this.prisma.user.count({
      where: {
        username,
      },
    });
    if (usernameExist > 0) return 'Username already exists';
    const emailExist = await this.prisma.user.count({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (emailExist > 0) return 'Email already exists';
    const phoneExist = await this.prisma.user.count({
      where: {
        phone: phone.split(' ').join(''),
      },
    });
    if (phoneExist > 0) return 'Phone already exists';
    return false;
  }

  async getAllUsername() {
    return await this.prisma.user.findMany({
      select: {
        username: true,
      },
    });
  }
}
