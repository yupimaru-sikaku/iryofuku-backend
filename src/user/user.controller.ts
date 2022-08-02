import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtoList/register.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
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

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.save({
      ...data,
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

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    const user = await this.userService.findOne({ where: { id } });

    const { password, ...data } = user;

    return {
      ...data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'ログアウトしました',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/info')
  async updateInfo(
    @Req() request: Request,
    @Body('office_name') office_name: string,
    @Body('postal_code') postal_code: string,
    @Body('address') address: string,
    @Body('personal_name') personal_name: string,
    @Body('phone_number') phone_number: string,
  ) {
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    await this.userService.update(id, {
      office_name,
      postal_code,
      address,
      personal_name,
      phone_number,
    });

    return this.userService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    await this.userService.update(id, {
      password: await bcrypt.hash(password, 12),
    });

    return this.userService.findOne({ where: { id } });
  }
}
