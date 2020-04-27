import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetProductsFilterDto {
    name: string;
    description: string;
    price: number;
}
