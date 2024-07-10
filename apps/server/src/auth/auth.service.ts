import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: SignDto) {
    const user = await this.userService.findWithPhone(dto);
    if (!user) {
      throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    }
    if (!(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      userId: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
    };
    return {
      token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }

  async signup(dto: CreateUserDto) {
    const user = await this.userService.findWithPhone(dto);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const res = await this.userService.createUser(dto);
    const payload = { userId: res.id, username: dto.username };
    return {
      token: await this.jwtService.signAsync(payload),
      user: {
        ...payload,
        phoneNumber: dto.phoneNumber,
      },
    };
  }
}
