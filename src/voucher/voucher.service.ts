import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher } from './voucher.schema';
import { CreateVoucherDto } from './dto/create-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(@InjectModel(Voucher.name) private voucherModel: Model<Voucher>) {}

  async findAll(userId: string) {
    return this.voucherModel.find({ userId }).exec();
  }

  async create(userId: string, createVoucherDto: CreateVoucherDto) {
    if (!createVoucherDto.isRepeated) {
      const existingVoucher = await this.voucherModel.findOne({
        voucherCode: createVoucherDto.voucherCode,
        userId,
      }).exec();
      if (existingVoucher) {
        throw new BadRequestException(
          `Voucher with code ${createVoucherDto.voucherCode} already exists for this user.`
        );
      }
    }
  
   
    const voucher = new this.voucherModel({
      voucherName: createVoucherDto.voucherName,
      voucherCode: createVoucherDto.voucherCode,
      discountType: createVoucherDto.discountType,
      discountValue: createVoucherDto.discountValue,
      minAmount: createVoucherDto.minAmount,
      maxAmount: createVoucherDto.maxAmount,
      activationDate: createVoucherDto.activationDate,
      expiryDate: createVoucherDto.expiryDate,
      userEmails: createVoucherDto.userEmails || [],
      isRepeated: createVoucherDto.isRepeated,
      userId, 
    });
  
    return voucher.save();
  }
  
  async findById(userId: string, id: string) {
    const voucher = await this.voucherModel.findOne({ _id: id, userId }).exec();
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found or access denied`);
    }
    return voucher;
  }

  async update(userId: string, id: string, updateVoucherDto: Partial<CreateVoucherDto>) {
   
    const updatedVoucher = await this.voucherModel.findOneAndUpdate(
      { _id: id, userId },
      updateVoucherDto,
      { new: true },
    );
    if (!updatedVoucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found or access denied`);
    }
    return updatedVoucher;
  }

  async delete(userId: string, id: string) {
    
    const deletedVoucher = await this.voucherModel.findOneAndDelete({ _id: id, userId });
    if (!deletedVoucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found or access denied`);
    }
    return deletedVoucher;
  }
}
