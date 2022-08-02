import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('company')
export class Company {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    company_name: string
    
    @Column({ unique: true })
    company_number: string
    
    @Column()
    postal_code: string
    
    @Column()
    address: string

    @Column()
    personal_name: string
    
    @Column()
    phone_number: string

    @Column({ unique: true })
    email: string
    
    @Column({ default: false})
    is_user: boolean
    
    @Column({ default: true })
    is_company: boolean
    
    @Column({ default: false })
    is_admin: boolean

    @Column()
    @Exclude()
    password: string
}