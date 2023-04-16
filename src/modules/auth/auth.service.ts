import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { comparePassword } from 'src/shares/utils/password.util';
import { UserService } from '../user/user.service';
import { ResponseLoginDto } from './dto/response-login.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './strategies/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async signup(signupData: SignupDto): Promise<ResponseLoginDto> {
    const isExists = await this.userService.checkUserExists(
      signupData.username
    );
    if (isExists) {
      throw new BadRequestException('Username already exists');
    }

    try {
      const newUser = await this.userService.create(signupData);
      const { accessToken, refreshToken } = await this.generateToken(newUser);
      delete newUser.password;
      return {
        accessToken,
        refreshToken,
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
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
    const refreshToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      refreshToken,
    };
  }
}
