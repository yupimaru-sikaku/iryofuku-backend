import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModlue } from 'src/shared/shared.module';
import { Admin } from './admin';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    SharedModlue
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
