import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Queue } from 'bull';
import { getKeyS3 } from 'src/shares/utils/get-key-s3.util';
import { hashPassword } from 'src/shares/utils/password.util';
import { RequestResetPasswordDto } from '../auth/dto/request-reset-password.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { comparePassword } from './../../shares/utils/password.util';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('send-mail') private readonly sendMail: Queue,
    private readonly uploadService: UploadService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, birthday, date_join, date_out, ...userData } =
      createUserDto;

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

  async changeAvatar(id: number, file: Express.Multer.File): Promise<User> {
    const user = await this.getUserInfoById(id);

    const { url } = await this.uploadService.uploadFile(file);
    const key = getKeyS3(user.avatar);
    if (key) await this.uploadService.deleteFileS3(key);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar: url,
      },
    });

    return await this.getUserInfoById(id);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<string> {
    const { password, newPassword, cfPassword } = data;
    const user = await this.getUserInfoById(id);
    if (newPassword !== cfPassword)
      throw new BadRequestException('Password not match');
    if (!(await comparePassword(password, user.password)))
      throw new BadRequestException('Password wrong');

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: await hashPassword(newPassword),
      },
    });
    return 'Change password successfully';
  }

  async resetPassword(id: number, data: ResetPasswordDto): Promise<string> {
    const { password, cfPassword } = data;
    await this.getUserInfoById(id);
    if (password !== cfPassword)
      throw new BadRequestException('Password not match');

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: await hashPassword(password),
      },
    });
    return 'Reset password successfully';
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const { email, phone, birthday, ...userData } = data;
    await this.getUserInfoById(id);
    const checkUserExists = await this.checkUserExists({
      email,
      phone,
    });
    if (checkUserExists) throw new BadRequestException(checkUserExists);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...userData,
        email: email?.toLowerCase(),
        phone: phone?.split(' ').join(''),
        birthday: birthday ? new Date(birthday) : null,
      },
    });

    return await this.getUserInfoById(id);
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

  async checkUserExists(data: {
    username?: string;
    email?: string;
    phone?: string;
  }): Promise<string | false> {
    const { username, email, phone } = data;
    if (username) {
      const usernameExist = await this.prisma.user.count({
        where: {
          username,
        },
      });
      if (usernameExist > 0) return 'Username already exists';
    }
    if (email) {
      const emailExist = await this.prisma.user.count({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (emailExist > 0) return 'Email already exists';
    }
    if (phone) {
      const phoneExist = await this.prisma.user.count({
        where: {
          phone: phone.split(' ').join(''),
        },
      });
      if (phoneExist > 0) return 'Phone already exists';
    }
    return false;
  }

  async getAllUsername() {
    return await this.prisma.user.findMany({
      select: {
        username: true,
      },
    });
  }

  async checkUserMailAndPhone(data: RequestResetPasswordDto): Promise<User> {
    const { username, email, phone } = data;
    const user = await this.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    if (user.email !== email.toLowerCase())
      throw new BadRequestException('Email or phone not match with username');
    if (user.phone !== phone.split(' ').join(''))
      throw new BadRequestException('Email or phone not match with username');

    delete user.password;
    return user;
  }
}
