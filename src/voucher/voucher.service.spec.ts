import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from './voucher.service';
import { Logger } from 'nestjs-pino'; 
import { Voucher } from './voucher.schema'; 
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';

// Mock logger
const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock Mongoose model
const mockModel = {
  findOne: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
};

describe('VoucherService', () => {
  let service: VoucherService;
  let model: Model<Voucher>;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        { 
          provide: Logger, 
          useValue: mockLogger, // Mock logger is injected
        },
        {
          provide: getModelToken(Voucher.name), // Mock the Mongoose model
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
    model = module.get<Model<Voucher>>(getModelToken(Voucher.name));
    logger = module.get<Logger>(Logger); // Retrieve the logger mock
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid data leakage
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create voucher', () => {
    it('should log an info message when creating a voucher', async () => {
      const createVoucherDto = {
        voucherCode: 'SUMMER21',
        voucherName: 'Summer Sale',
        discountType: 'percentage',
        discountValue: 20,
        minAmount: 100,
        maxAmount: 200,
        activationDate: new Date().toISOString(),
        expiryDate: new Date().toISOString(),
        isRepeated: false,
      };

      // Mock the behavior of `findOne` (for checking existing vouchers)
      mockModel.findOne.mockResolvedValue(null);

      // Mock the save method to return the voucher data
      mockModel.save.mockResolvedValue(createVoucherDto);

      // Call the service method
      await service.create(createVoucherDto);

      // Assert that the logger was called with the expected message
      expect(logger.log).toHaveBeenCalledWith('Voucher created successfully', createVoucherDto);
    });

    it('should throw an error if voucher code already exists', async () => {
      const createVoucherDto = {
        voucherCode: 'SUMMER21',
        voucherName: 'Summer Sale',
        discountType: 'percentage',
        discountValue: 20,
        minAmount: 100,
        maxAmount: 200,
        activationDate: new Date().toISOString(),
        expiryDate: new Date().toISOString(),
        isRepeated: false,
      };

      // Mock the behavior of `findOne` to simulate an existing voucher
      mockModel.findOne.mockResolvedValue(createVoucherDto);

      // Call the service method and expect an error
      await expect(service.create(createVoucherDto)).rejects.toThrow(
        new BadRequestException('Voucher with code SUMMER21 already exists.')
      );

      // Assert that the logger was called with the error message
      expect(logger.error).toHaveBeenCalledWith('Voucher with code SUMMER21 already exists.');
    });
  });

  describe('calculate discount', () => {
    it('should log an error when voucher is expired', async () => {
      const voucher = {
        voucherCode: 'SUMMER21',
        discountType: 'percentage',
        discountValue: 20,
        minAmount: 100,
        maxAmount: 200,
        expiryDate: new Date('2022-01-01'), // Expired date
      };

      // Mock findOne to return a voucher
      mockModel.findOne.mockResolvedValue(voucher);

      const purchaseAmount = 150;
      await expect(service.calculateDiscount('SUMMER21', purchaseAmount)).rejects.toThrow(
        new BadRequestException('Voucher has expired.')
      );

      // Check that error was logged
      expect(logger.error).toHaveBeenCalledWith('Voucher has expired.');
    });
  });
});
