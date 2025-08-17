import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PropertyCategory } from '../../enums/enums';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  bathroom: number;

  @IsNumber()
  @IsNotEmpty()
  toilets: number;

  @IsNumber()
  @IsNotEmpty()
  parkingSpace: number;

  @IsNumber()
  @IsNotEmpty()
  rooms: number;

  @IsEnum(PropertyCategory)
  @IsOptional()
  category?: PropertyCategory;
}
