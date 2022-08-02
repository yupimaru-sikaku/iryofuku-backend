import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('admin')
export class Admin {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    is_user: boolean;

    @Column({ default: false })
    is_company: boolean;

    @Column({ default: true })
    is_admin: boolean;

    @Column()
    @Exclude()
    password: string;
    
}