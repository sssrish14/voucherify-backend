import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { isValidObjectId } from 'mongoose';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  async findAll(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.voucherService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('userId') userId: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid voucher ID format');
    }
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.voucherService.findById(userId, id);
  }

  @Post()
  async create(
    @Query('userId') userId: string, 
    @Body() createVoucherDto: CreateVoucherDto,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.voucherService.create(userId, createVoucherDto);
  }



  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() createVoucherDto: CreateVoucherDto,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.voucherService.update(userId, id, createVoucherDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.voucherService.delete(userId, id);
  }
}
