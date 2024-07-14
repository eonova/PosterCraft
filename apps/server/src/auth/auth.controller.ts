import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { DefaultLoginDto, PhoneOtpLoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserEntity, User } from '../user/user.decorators';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('用户鉴权接口🤖')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('defaultLogin')
  @ApiBody({ type: DefaultLoginDto })
  @ApiOperation({ summary: '默认登陆', description: '使用用户名/邮箱登陆' })
  defaultLogin(@Body() dto: DefaultLoginDto) {
    return this.authService.defaultLogin(dto);
  }

  @Post('phoneOtpLogin')
  @ApiBody({ type: PhoneOtpLoginDto })
  @ApiOperation({ summary: '短信登陆', description: '短信登陆' })
  phoneOtpLogin(@Body() dto: PhoneOtpLoginDto) {
    return this.authService.phoneOtpLogin(dto);
  }

  @Post('signup')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: '注册', description: '注册' })
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  // @Get('sendCodeByEmail')
  // @ApiOperation({ summary: '发送邮箱验证码', description: '发送邮箱验证码并返回' })
  // sendCodeByEmail(@Body() dto: PhoneOtpLoginDto) {
  //   return this.authService.phoneOtpLogin(dto);
  // }

  @UseGuards(AuthGuard)
  @Get('userInfo')
  @ApiOperation({ summary: '获取用户信息', description: '获取用户信息' })
  userInfo(@User() user: UserEntity) {
    return user;
  }
}
