import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsDate,
  IsDateString,
  MinDate,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(5)
  @Max(300)
  price: number;


  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @Max(99999999)
  quantity: number;
}
