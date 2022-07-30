import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    company_name: string
    
    @Column()
    office_name: string
    
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
    
    @Column({ default: true })
    is_user: boolean
    
    @Column({ default: false })
    is_company: boolean
    
    @Column({ default: false })
    is_admin: boolean

    @Column()
    @Exclude()
    password: string
}