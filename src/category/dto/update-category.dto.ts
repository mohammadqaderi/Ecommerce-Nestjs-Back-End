import { IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CategoryTypes } from '../category-types.enum';

export class UpdateCategoryDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  description: string;

}
