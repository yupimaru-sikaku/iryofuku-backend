import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModlue } from 'src/shared/shared.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './compnay';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    SharedModlue
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
