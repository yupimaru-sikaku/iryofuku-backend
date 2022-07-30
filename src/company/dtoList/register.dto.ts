import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {

    @IsNotEmpty()
    compnay_name: string;
    
    @IsNotEmpty()
    company_number: string;
    
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