import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModlue } from 'src/shared/shared.module';
import { User } from './user';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedModlue
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
