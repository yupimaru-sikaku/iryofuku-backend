import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { Admin } from './admin';

@Injectable()
export class AdminService extends AbstractService{
    constructor(
        @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>
    ){
        super(adminRepository);
    }
}
