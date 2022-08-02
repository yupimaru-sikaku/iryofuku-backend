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
import { CompanyService } from './company.service';
import { RegisterDto } from './dtoList/register.dto';
import * as bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private jwtService: JwtService,
  ) {}

  @Post('company/register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const { password_confirm, ...data } = body;

    const hashed = await bcrypt.hash(body.password, 12);

    return this.companyService.save({
      ...data,
      password: hashed,
      is_user: false,
      is_company: true,
      is_admin: false,
    });
  }

  @Post('company/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const company = await this.companyService.findOne({ where: { email } });

    if (!company) {
      throw new NotFoundException('メールアドレスが存在しません');
    }

    if (!(await bcrypt.compare(password, company.password))) {
      throw new BadRequestException('パスワードが一致しません');
    }

    const jwt = await this.jwtService.signAsync({
      id: company.id,
      scope: 'company',
    });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'ログインしました',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('company')
  async company(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    const company = await this.companyService.findOne({ where: { id } });

    const { password, ...data } = company;

    return {
      ...data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('company/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'ログアウトしました',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('company/info')
  async updateInfo(
    @Body('postal_code') postal_code: string,
    @Body('address') address: string,
    @Body('personal_name') personal_name: string,
    @Body('phone_number') phone_number: string,
    @Req() request: Request,
  ) {
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    await this.companyService.update(id, {
      postal_code,
      address,
      personal_name,
      phone_number,
    });

    return this.companyService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Put('company/password')
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

    await this.companyService.update(id, {
      password: await bcrypt.hash(password, 12),
    });

    return this.companyService.findOne({ where: { id } });
  }
}
