import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher } from './voucher.schema';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class VoucherRepository {
  private readonly logger = new Logger(VoucherRepository.name);

  constructor(@InjectModel(Voucher.name) private voucherModel: Model<Voucher>) {}


  async create(createVoucherDto: CreateVoucherDto) {
    this.logger.log(`Checking if voucher with code ${createVoucherDto.voucherCode} exists...`);
    const existingVoucher = await this.voucherModel.findOne({
      voucherCode: createVoucherDto.voucherCode,
    }).exec();
    
    if (existingVoucher) {
      this.logger.error(`Voucher with code ${createVoucherDto.voucherCode} already exists.`);
      throw new BadRequestException(`Voucher with code ${createVoucherDto.voucherCode} already exists.`);
    }

    const voucher = new this.voucherModel(createVoucherDto);
    this.logger.log(`Saving new voucher with code ${createVoucherDto.voucherCode}...`);
    return voucher.save();
  }

  async findByVoucherCode(voucherCode: string): Promise<Voucher | null> {
    return this.voucherModel.findOne({ voucherCode }).exec();
  }
  
  async findAll() {
    return this.voucherModel.find().exec();
  }

 
  async findById(id: string) {
    return this.voucherModel.findById(id).exec();
  }

  
  async update(id: string, updateVoucherDto: Partial<CreateVoucherDto>) {
    return this.voucherModel.findByIdAndUpdate(id, updateVoucherDto, { new: true }).exec();
  }

  
  async delete(id: string) {
    return this.voucherModel.findByIdAndDelete(id).exec();
  }

  async isVoucherCodeExist(voucherCode: string): Promise<boolean> {
    const voucher = await this.voucherModel.findOne({ voucherCode }).exec();
    return !!voucher;
  }


  async calculateDiscount(voucherCode: string, purchaseAmount: number) {
    const voucher = await this.voucherModel.findOne({ voucherCode }).exec();
    if (!voucher) {
      throw new BadRequestException('Invalid voucher code.');
    }
    if (this.isVoucherExpired(voucher.expiryDate)) {
      throw new BadRequestException('Voucher has expired.');
    }
    Logger.warn(voucher)
    if (purchaseAmount < voucher.minAmount ) {
      throw new BadRequestException('Purchase amount should be greater than the minimum value of the voucher code.');
    }
    if (purchaseAmount > voucher.maxAmount ) {
        throw new BadRequestException('Purchase amount should be less than the maximum value of the voucher code.');
      }
    let discountAmount = 0;
    if (voucher.discountType === 'percentage') {
      discountAmount = (purchaseAmount * voucher.discountValue) / 100;
    } else if (voucher.discountType === 'amount') {
      discountAmount = voucher.discountValue;
    }

    if (discountAmount > voucher.maxAmount) {
      discountAmount = voucher.maxAmount;
    }

    return {
      discountAmount,
      finalAmount: purchaseAmount - discountAmount,
    };
  }

  private isVoucherExpired(expiryDate: Date): boolean {
    return new Date() > new Date(expiryDate);
  }
}
