import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1950)
  @Max(2021)
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsNumber()
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsNumber()
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(100000)
  @Transform(({ value }) => parseInt(value))
  mileage: number;
}
