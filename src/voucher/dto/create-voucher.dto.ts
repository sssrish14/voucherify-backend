import {
    IsString,
    IsEnum,
    IsNumber,
    IsDateString,
    IsOptional,
    IsArray,
    ArrayNotEmpty,
    Min,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateVoucherDto {
    @IsString()
    voucherName: string;
  
    @IsString()
    voucherCode: string; 
  
    @IsEnum(['percentage', 'amount'])
    discountType: string;
  
    @IsNumber()
    discountValue: number;
  
    @IsNumber()
    @Min(0)
    minAmount: number;
  
    @IsNumber()
    @Min(0)
    maxAmount: number;
  
    @IsDateString()
    activationDate: string;
  
    @IsDateString()
    expiryDate: string;
  
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    userEmails?: string[];

    @IsBoolean()
    isRepeated: boolean;
  }
  