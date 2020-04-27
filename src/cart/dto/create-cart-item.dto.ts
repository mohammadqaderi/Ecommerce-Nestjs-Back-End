import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    total_items: number;
}