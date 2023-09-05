import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Position, User, UserStatus } from '@prisma/client';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { comparePassword, hashPassword } from 'src/shares/utils';
import {
  ChangePasswordFirstLoginDto,
  RequestResetPasswordDto,
} from '../auth/dto';
import { MailQueueService } from '../mail/services';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
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

  async checkUserExisted(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id } });
    if (count === 0) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return true;
  }

  async create(
    createUserDto: CreateUserDto,
    isSendMail: boolean
  ): Promise<User> {
    const { password, birthday, dateJoin, dateOut, ...userData } =
      createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: await hashPassword(password),
        dateJoin: new Date(dateJoin),
        dateOut: dateOut ? new Date(dateOut) : null,
        birthday: birthday ? new Date(birthday) : null,
        email: userData.email?.toLowerCase(),
        phone: userData.phone?.split(' ').join(''),
      },
    });

    if (isSendMail) {
      await this.mailQueueService.addWelcomeMail({
        email: user.email,
        name: user.fullname,
        username: user.username,
        password,
      });
    }

    delete user.password;
    return user;
  }

  async createMany(createUserDtos: CreateUserDto[], isSendMail: boolean) {
    const data = await Promise.all(
      createUserDtos.map(
        async ({
          email,
          phone,
          birthday,
          password,
          dateJoin,
          dateOut,
          ...userData
        }) => ({
          ...userData,
          password: await hashPassword(password),
          dateJoin: new Date(dateJoin),
          dateOut: dateOut ? new Date(dateOut) : null,
          birthday: birthday ? new Date(birthday) : null,
          email: email?.toLowerCase(),
          phone: phone?.split(' ').join(''),
        })
      )
    );
    const res = await this.prisma.user.createMany({ data });

    if (isSendMail) {
      for (const user of createUserDtos) {
        await this.mailQueueService.addWelcomeMail({
          email: user.email?.toLowerCase(),
          name: user.fullname,
          username: user.username,
          password: user.password,
        });
      }
    }

    return res;
  }

  async getAll(
    page: number,
    limit: number
  ): Promise<ResponseDto<Omit<User, 'password'>[]>> {
    if (isNaN(page) || isNaN(limit))
      throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

    const users = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        dateJoin: 'desc',
      },
    });

    const modifiedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      data: modifiedUsers,
      pagination: {
        totalPage: Math.ceil((await this.prisma.user.count()) / limit),
      },
    };
  }

  async getUserInfoById(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user)
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    delete user.password;
    return user;
  }

  async changeAvatar(id: string, file: Express.Multer.File): Promise<User> {
    const user = await this.getUserInfoById(id);
    const key = `avatar/${user.username}_${Math.round(Math.random() * 1e9)}`;
    const { url } = await this.uploadService.uploadFile(file, key);
    await this.uploadService.deleteFileS3(user.avatar);

    await this.prisma.user.update({
      where: { id },
      data: { avatar: url },
    });

    return await this.getUserInfoById(id);
  }

  async changePassword(
    id: string,
    data: ChangePasswordDto
  ): Promise<MessageDto> {
    const { password, newPassword, cfPassword } = data;
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
      },
    });
    if (!user)
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
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
      where: { id },
      data: { password: await hashPassword(newPassword) },
    });
    return messageSuccess.USER_CHANGE_PASSWORD;
  }

  async changePasswordInFirstLogin(
    id: string,
    data: ChangePasswordFirstLoginDto
  ): Promise<MessageDto> {
    const { password, cfPassword } = data;
    await this.getUserInfoById(id);
    if (password !== cfPassword)
      throw new HttpException(
        httpErrors.PASSWORD_NOT_MATCH,
        HttpStatus.BAD_REQUEST
      );

    await this.prisma.user.update({
      where: { id },
      data: {
        password: await hashPassword(password),
        status: UserStatus.ACTIVE,
      },
    });
    return messageSuccess.USER_CHANGE_PASSWORD;
  }

  async resetPassword(id: string, data: ResetPasswordDto): Promise<MessageDto> {
    const { password, cfPassword } = data;
    await this.getUserInfoById(id);
    if (password !== cfPassword)
      throw new HttpException(
        httpErrors.PASSWORD_NOT_MATCH,
        HttpStatus.BAD_REQUEST
      );

    await this.prisma.user.update({
      where: { id },
      data: { password: await hashPassword(password) },
    });
    return messageSuccess.USER_RESET_PASSWORD;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const { email, phone, birthday, ...userData } = data;
    const user = await this.getUserInfoById(id);
    if (email && user.email !== email.toLowerCase()) {
      const checkEmailExists = await this.checkUserExists({ email });
      if (checkEmailExists)
        throw new HttpException(checkEmailExists, HttpStatus.BAD_REQUEST);
    }
    if (phone && user.phone !== phone.split(' ').join('')) {
      const checkPhoneExists = await this.checkUserExists({ phone });
      if (checkPhoneExists)
        throw new HttpException(checkPhoneExists, HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: { id },
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
      where: { username },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async checkUserExists(data: {
    username?: string;
    email?: string;
    phone?: string;
  }): Promise<MessageDto | false> {
    const { username, email, phone } = data;
    if (username) {
      const usernameExist = await this.prisma.user.count({
        where: { username },
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
      select: { username: true },
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

  // async getUserBirthday() {
  //   const today = new Date();
  //   const users = await this.prisma.$queryRaw<
  //     HappyBirthdayDto[]
  //   >`SELECT fullname, email from "User" where DATE_PART('day', "birthday") = ${today.getDate()} AND DATE_PART('month', "birthday") = ${
  //     today.getMonth() + 1
  //   }`;
  //   return users;
  // }

  async getManagement() {
    const doiTruong = await this.prisma.user.findMany({
      where: { position: Position.DOI_TRUONG },
      select: {
        id: true,
        username: true,
        fullname: true,
        avatar: true,
        position: true,
      },
    });
    const doiPho = await this.prisma.user.findMany({
      where: { position: Position.DOI_PHO },
      select: {
        id: true,
        username: true,
        fullname: true,
        avatar: true,
        position: true,
      },
    });
    return [...doiTruong, ...doiPho];
  }
}
