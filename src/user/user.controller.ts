import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtoList/register.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('user/register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const { password_confirm, ...data } = body;

    const uuid = uuidV4()

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.save({
      ...data,
      id: uuid,
      password: hashed,
      is_user: true,
      is_admin: false,
      is_company: false,
    });
  }

  @Post('user/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('該当するメールアドレスが存在しません');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      scope: 'user',
    });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'ログインしました',
    };
  }
}
