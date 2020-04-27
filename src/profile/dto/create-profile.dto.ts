import { IsNotEmpty, IsString, IsEmail, IsNumber, IsNumberString } from "class-validator";

export class CreateProfileDto {

    firstname: string;

    
    lastname: string;


    email: string;

    gender: string;


    age: string;

    country: string;


    city: string;

  
    address: string;


    phone: string;

}