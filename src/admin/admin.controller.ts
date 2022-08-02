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
import { AdminService } from './admin.service';
import { RegisterDto } from './dtoList/register.dto';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  @Post('admin/register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const { password_confirm, ...data } = body;

    const hased = await bcrypt.hash(body.password, 12);

    return this.adminService.save({
      ...data,
      password: hased,
      is_user: false,
      is_company: false,
      is_admin: true,
    });
  }

  @Post('admin/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const admin = await this.adminService.findOne({ where: { email } });

    if (!admin) {
      throw new NotFoundException('Eメールが存在しません');
    }

    if (!(await bcrypt.compare(password, admin.password))) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const jwt = await this.jwtService.signAsync({
      id: admin.id,
      scope: 'admin',
    });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'ログインしました',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async admin(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    const admin = await this.adminService.findOne({ where: { id } });

    const { pasword, ...date } = admin;

    return {
      ...date,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'ログアウトしました',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/password')
  async updatePassword(
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
    @Req() request: Request,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    this.adminService.update(id, {
      password: await bcrypt.hash(password, 12),
    });

    return this.adminService.findOne({ where: { id } });
  }
}
