import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './compnay';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company])
  ],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
