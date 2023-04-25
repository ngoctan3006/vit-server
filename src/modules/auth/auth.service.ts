import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { AES, enc } from 'crypto-js';
import { EnvConstant } from 'src/shares/constants/env.constant';
import { generateUsername } from 'src/shares/utils/generate-username.util';
import { getGender } from 'src/shares/utils/get-gender.util';
import { getPosition } from 'src/shares/utils/get-position.util';
import { comparePassword } from 'src/shares/utils/password.util';
import { read, utils } from 'xlsx';
import { UserService } from '../user/user.service';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './strategies/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectQueue('send-mail') private readonly sendMail: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async signup(signupData: SignupDto): Promise<ResponseLoginDto> {
    const { email, phone, username } = signupData;

    const isExists = await this.userService.checkUserExists({
      username,
      email,
      phone,
    });
    if (isExists) {
      throw new BadRequestException(isExists);
    }
    const newUser = await this.userService.create(signupData);
    const { accessToken, refreshToken } = await this.generateToken(newUser);
    delete newUser.password;
    return {
      accessToken,
      refreshToken,
      user: newUser,
    };
  }

  async signin(signinData: SigninDto): Promise<ResponseLoginDto> {
    const { username, password } = signinData;
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new BadRequestException('Username or password is incorrect');
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Username or password is incorrect');
    }
    const { accessToken, refreshToken } = await this.generateToken(user);
    delete user.password;
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async importMany(file: Express.Multer.File) {
    const fileData = read(file.buffer, { type: 'buffer', cellDates: true });
    const jsonData = utils.sheet_to_json(
      fileData.Sheets[fileData.SheetNames[0]]
    );
    const usernameList = (await this.userService.getAllUsername()).map(
      (item) => item.username
    );
    const userData = jsonData.map((user: any) => {
      let username = generateUsername(user.Fullname);
      const usernameCount = usernameList.filter(
        (item) => item.replace(/\d/g, '') === username
      ).length;
      if (usernameCount > 0) {
        username = `${username}${usernameCount + 1}`;
      }
      usernameList.push(username);

      return {
        username,
        password: Math.random().toString(36).slice(-8),
        fullname: user.Fullname,
        phone: user.Phone?.split(' ').join(''),
        email: user.Email?.toLowerCase(),
        birthday: user.Birthday,
        school: user.School,
        student_id: user.StudentID,
        class: user.Class,
        date_join: new Date(user['Date Join']).getTime() + 8 * 60 * 60 * 1000,
        date_out:
          user['Date Out'] ??
          new Date(user['Date Out']).getTime() + 8 * 60 * 60 * 1000,
        gender: getGender(user.Gender),
        position: getPosition(user.Position),
      };
    });
    const result = await this.userService.createMany(userData);
    console.log(result);

    return userData;
  }

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

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>(
          EnvConstant.JWT_REFRESH_TOKEN_SECRET
        ),
      });

      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new BadRequestException('refresh token is invalid');
      }

      delete payload.iat;
      delete payload.exp;

      const newAccessToken = await this.jwtService.signAsync(payload);
      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('refresh token is expired');
    }
  }

  async requestResetPassword(
    data: RequestResetPasswordDto
  ): Promise<{ message: string }> {
    const user = await this.userService.checkUserMailAndPhone(data);
    const enc = AES.encrypt(
      JSON.stringify(data),
      this.configService.get<string>(EnvConstant.ENC_PASSWORD)
    ).toString();
    await this.cacheManager.set(
      user.username,
      enc,
      this.configService.get<number>(EnvConstant.CACHE_TTL)
    );
    await this.sendMail.add(
      'reset-password',
      {
        ...data,
        name: user.fullname,
        resetPasswordUrl: `${this.configService.get<string>(
          EnvConstant.CLIENT_URL
        )}/reset-password?token=${enc}`,
      },
      {
        removeOnComplete: true,
      }
    );

    return {
      message: 'Link reset password has been sent to your email',
    };
  }

  async checkTokenResetPassword(token: string): Promise<User> {
    try {
      const data = JSON.parse(
        AES.decrypt(
          token,
          this.configService.get<string>(EnvConstant.ENC_PASSWORD)
        ).toString(enc.Utf8)
      );
      const cache = await this.cacheManager.get<string>(data.username);
      if (!cache) {
        throw new BadRequestException('token is expired');
      }
      if (cache !== token) {
        throw new BadRequestException('token is invalid');
      }
      return await this.userService.checkUserMailAndPhone(data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error?.response?.message || 'token is invalid'
      );
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password, cfPassword } = data;

    try {
      const user = await this.checkTokenResetPassword(token);
      const message = await this.userService.resetPassword(user.id, {
        password,
        cfPassword,
      });
      await this.cacheManager.del(user.username);
      return { message };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error?.response?.message || 'token is invalid'
      );
    }
  }
}
