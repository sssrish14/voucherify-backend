import { Injectable, NotFoundException, BadRequestException, Logger, UseInterceptors} from '@nestjs/common';
import { VoucherRepository } from './voucher.repository';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { LoggingInterceptor } from './interceptors/Logger.interceptor';

@Injectable()
export class VoucherService {

  private readonly logger = new Logger(VoucherService.name, { timestamp: true });
  
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async create(createVoucherDto: CreateVoucherDto) {
    this.logger.log(`Creating voucher with code: ${createVoucherDto.voucherCode}`);
    const createdVoucher = await this.voucherRepository.create(createVoucherDto);
    this.logger.log(`Voucher with code ${createVoucherDto.voucherCode} created successfully`);
    return createdVoucher;
  }

  async findAll() {
    return this.voucherRepository.findAll();
  }

  async findByVoucherCode(voucherCode: string) {
    return this.voucherRepository.findByVoucherCode(voucherCode);
  }

  async findById(id: string) {
    const voucher = await this.voucherRepository.findById(id);
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return voucher;
  }

  async update(id: string, updateVoucherDto: Partial<CreateVoucherDto>) {
    const updatedVoucher = await this.voucherRepository.update(id, updateVoucherDto);
    if (!updatedVoucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return updatedVoucher;
  }

  async delete(id: string) {
    const deletedVoucher = await this.voucherRepository.delete(id);
    if (!deletedVoucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return deletedVoucher;
  }

  async calculateDiscount(voucherCode: string, purchaseAmount: number) {
    return this.voucherRepository.calculateDiscount(voucherCode, purchaseAmount);
  }
}

