import { IsNumberString, IsNotEmpty, IsDate } from "class-validator";

export class CreateInvoiceDto {

    @IsNumberString()
    @IsNotEmpty()
    number: string;


    @IsDate()
    @IsNotEmpty()
    due_date: Date;
}