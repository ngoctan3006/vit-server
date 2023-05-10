import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Status, User } from '@prisma/client';
import { httpErrors } from 'src/shares/exception';
import { getKeyS3, hashPassword } from 'src/shares/utils';
import {
  ChangePasswordFirstLoginDto,
  RequestResetPasswordDto,
} from '../auth/dto';
import { MailQueueService } from '../mail/services';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { comparePassword } from './../../shares/utils';
import {
  ChangePasswordDto,
  CreateUserDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailQueueService: MailQueueService,
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

    await this.mailQueueService.addWelcomeMail({
      email: user.email,
      name: user.fullname,
      username: user.username,
      password,
    });

    delete user.password;
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
      await this.mailQueueService.addWelcomeMail({
        email: user.email?.toLowerCase(),
        name: user.fullname,
        username: user.username,
        password: user.password,
      });
    }

    return res;
  }

  async getUserInfoById(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user)
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
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
      throw new HttpException(
        httpErrors.PASSWORD_NOT_MATCH,
        HttpStatus.BAD_REQUEST
      );
    if (!(await comparePassword(password, user.password)))
      throw new HttpException(
        httpErrors.PASSWORD_WRONG,
        HttpStatus.BAD_REQUEST
      );

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

  async changePasswordInFirstLogin(
    id: number,
    data: ChangePasswordFirstLoginDto
  ): Promise<string> {
    const { password, cfPassword } = data;
    await this.getUserInfoById(id);
    if (password !== cfPassword)
      throw new HttpException(
        httpErrors.PASSWORD_NOT_MATCH,
        HttpStatus.BAD_REQUEST
      );

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: await hashPassword(password),
        status: Status.ACTIVE,
      },
    });
    return 'Change password successfully';
  }

  async resetPassword(id: number, data: ResetPasswordDto): Promise<string> {
    const { password, cfPassword } = data;
    await this.getUserInfoById(id);
    if (password !== cfPassword)
      throw new HttpException(
        httpErrors.PASSWORD_NOT_MATCH,
        HttpStatus.BAD_REQUEST
      );

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
    if (checkUserExists)
      throw new HttpException(checkUserExists, HttpStatus.BAD_REQUEST);

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
  }): Promise<
    | {
        message: string;
        code: string;
      }
    | false
  > {
    const { username, email, phone } = data;
    if (username) {
      const usernameExist = await this.prisma.user.count({
        where: {
          username,
        },
      });
      if (usernameExist > 0) return httpErrors.USERNAME_EXISTED;
    }
    if (email) {
      const emailExist = await this.prisma.user.count({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (emailExist > 0) return httpErrors.EMAIL_EXISTED;
    }
    if (phone) {
      const phoneExist = await this.prisma.user.count({
        where: {
          phone: phone.split(' ').join(''),
        },
      });
      if (phoneExist > 0) return httpErrors.PHONE_EXISTED;
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
    if (!user)
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    if (user.email !== email.toLowerCase())
      throw new HttpException(
        httpErrors.EMAIL_PHONE_NOT_MATCH,
        HttpStatus.BAD_REQUEST
      );
    if (user.phone !== phone.split(' ').join(''))
      throw new HttpException(
        httpErrors.EMAIL_PHONE_NOT_MATCH,
        HttpStatus.BAD_REQUEST
      );

    delete user.password;
    return user;
  }
}
