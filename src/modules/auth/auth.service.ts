import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { EnvConstant } from 'src/shares/constants';
import { httpErrors } from 'src/shares/exception';
import { messageSuccess } from 'src/shares/message';
import { comparePassword } from 'src/shares/utils';
import { MailQueueService } from '../mail/services';
import { User } from '../user/entities';
import { UserService } from '../user/user.service';
import { ResponseLoginDto, SigninDto, SignupDto } from './dto';
import { JwtPayload } from './strategies';
import { generatePassword, generateUsername } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailQueueService: MailQueueService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getMe(id: string): Promise<User> {
    return this.userService.getUserInfoById(String(id));
  }

  async signup(signupData: SignupDto) {
    const { email, phone, fullname, isSendMail } = signupData;

    const isExists = await this.userService.checkUserExists({
      email,
      phone,
    });
    if (isExists) {
      throw new BadRequestException(isExists);
    }
    const usernameList = (await this.userService.getAllUsername()).map(
      (item) => item.username
    );
    let username = generateUsername(fullname);
    const usernameCount = usernameList.filter(
      (item) => item.replace(/\d/g, '') === username
    ).length;
    if (usernameCount > 0) {
      username = `${username}${usernameCount + 1}`;
    }
    delete signupData.isSendMail;
    await this.userService.create(
      {
        ...signupData,
        username,
        password: generatePassword(),
      },
      Boolean(isSendMail)
    );
    return { data: messageSuccess.USER_IMPORT };
  }

  async signin(signinData: SigninDto): Promise<ResponseLoginDto> {
    const { username, password } = signinData;
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new HttpException(httpErrors.LOGIN_WRONG, HttpStatus.BAD_REQUEST);
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new HttpException(httpErrors.LOGIN_WRONG, HttpStatus.BAD_REQUEST);
    }
    const { accessToken, refreshToken } = await this.generateToken(user);
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  // async importMany(file: Express.Multer.File, isSendMail: boolean) {
  //   const fileData = read(file.buffer, { type: 'buffer', cellDates: true });
  //   const jsonData = utils.sheet_to_json(
  //     fileData.Sheets[fileData.SheetNames[0]]
  //   );
  //   const usernameList = (await this.userService.getAllUsername()).map(
  //     (item) => item.username
  //   );
  //   const userData = jsonData.map<CreateUserDto>((user: any) => {
  //     let username = generateUsername(user.Fullname);
  //     const usernameCount = usernameList.filter(
  //       (item) => item.replace(/\d/g, '') === username
  //     ).length;
  //     if (usernameCount > 0) {
  //       username = `${username}${usernameCount + 1}`;
  //     }
  //     usernameList.push(username);

  //     return {
  //       username,
  //       password: generatePassword(),
  //       fullname: user.Fullname,
  //       phone: String(user.Phone)?.split(' ').join(''),
  //       email: user.Email?.toLowerCase(),
  //       birthday:
  //         user['Birthday'] &&
  //         new Date(user['Birthday']).getTime() + 8 * 60 * 60 * 1000,
  //       school: user.School,
  //       gen: user.Gen,
  //       student_id: user.StudentID && String(user.StudentID),
  //       cccd: user.CCCD && String(user.CCCD),
  //       class: user.Class,
  //       date_join:
  //         user['Date Join'] &&
  //         new Date(user['Date Join']).getTime() + 8 * 60 * 60 * 1000,
  //       date_out:
  //         user['Date Out'] &&
  //         new Date(user['Date Out']).getTime() + 8 * 60 * 60 * 1000,
  //       gender: getGender(user.Gender),
  //       position: getPosition(user.Position),
  //     };
  //   });
  //   await this.userService.createMany(userData, isSendMail);

  //   return {
  //     data: messageSuccess.USER_IMPORT,
  //   };
  // }

  async generateToken(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      position: user.position,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(
        EnvConstant.JWT_REFRESH_TOKEN_SECRET
      ),
      expiresIn: this.configService.get<number>(
        EnvConstant.JWT_REFRESH_TOKEN_EXPIRATION_TIME
      ),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>(
            EnvConstant.JWT_REFRESH_TOKEN_SECRET
          ),
        }
      );

      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new HttpException(
          httpErrors.REFRESH_TOKEN_INVALID,
          HttpStatus.BAD_REQUEST
        );
      }

      delete payload.iat;
      delete payload.exp;

      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch (error) {
      throw new HttpException(
        httpErrors.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // async requestResetPassword(
  //   data: RequestResetPasswordDto
  // ): Promise<ResponseDto<MessageDto>> {
  //   const user = await this.userService.checkUserMailAndPhone(data);
  //   const enc = AES.encrypt(
  //     JSON.stringify(data),
  //     this.configService.get<string>(EnvConstant.ENC_PASSWORD)
  //   ).toString();
  //   await this.cacheManager.set(
  //     user.username,
  //     enc,
  //     this.configService.get<number>(EnvConstant.CACHE_TTL)
  //   );
  //   await this.mailQueueService.addResetPasswordMail({
  //     ...data,
  //     name: user.fullname,
  //     resetPasswordUrl: `${this.configService.get<string>(
  //       EnvConstant.CLIENT_URL
  //     )}/reset-password?token=${enc}`,
  //   });

  //   return { data: messageSuccess.USER_REQUEST_RESET_PASSWORD };
  // }

  // async checkTokenResetPassword(token: string): Promise<User> {
  //   try {
  //     const data = JSON.parse(
  //       AES.decrypt(
  //         token,
  //         this.configService.get<string>(EnvConstant.ENC_PASSWORD)
  //       ).toString(enc.Utf8)
  //     );
  //     const cache = await this.cacheManager.get<string>(data.username);
  //     if (!cache) {
  //       throw new HttpException(
  //         httpErrors.TOKEN_EXPIRED,
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }
  //     if (cache !== token) {
  //       throw new HttpException(
  //         httpErrors.TOKEN_INVALID,
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }
  //     return await this.userService.checkUserMailAndPhone(data);
  //   } catch (error) {
  //     throw new HttpException(httpErrors.TOKEN_INVALID, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async resetPassword(
  //   data: ResetPasswordDto
  // ): Promise<ResponseDto<MessageDto>> {
  //   const { token, password, cfPassword } = data;

  //   try {
  //     const user = await this.checkTokenResetPassword(token);
  //     const message = await this.userService.resetPassword(user.id, {
  //       password,
  //       cfPassword,
  //     });
  //     await this.cacheManager.del(user.username);
  //     return { data: message };
  //   } catch (error) {
  //     throw new HttpException(httpErrors.TOKEN_INVALID, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async changePasswordInFirstLogin(
  //   id: number,
  //   data: ChangePasswordFirstLoginDto
  // ): Promise<MessageDto> {
  //   return await this.userService.changePasswordInFirstLogin(id, data);
  // }
}
