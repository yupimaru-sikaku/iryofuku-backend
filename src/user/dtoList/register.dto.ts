import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {

    @IsNotEmpty()
    company_name: string;
    
    office_name: string;
    
    @IsNotEmpty()
    postal_code: string;
    
    @IsNotEmpty()
    address: string;
    
    @IsNotEmpty()
    personal_name: string;
    
    @IsNotEmpty()
    phone_number: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    password_confirm: string;
}