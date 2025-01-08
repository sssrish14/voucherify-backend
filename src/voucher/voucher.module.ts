import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './voucher.schema';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { VoucherRepository } from './voucher.repository';
import { ValidateExpiryDateMiddleware } from './midlewares/voucher.middleware';
import { JwtModule } from '@nestjs/jwt'; 
import { JwtAuthGuard } from 'src/Auth/JWT/jwt-auth.guard'; 
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Set your secret key here or use env var
      signOptions: { expiresIn: '1h' }, // Optional: Set token expiration time
    }),
    AuthModule, // Ensure that AuthModule is imported if it contains the JwtAuthGuard
  ],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepository, JwtAuthGuard], // Add JwtAuthGuard if necessary
})
export class VoucherModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateExpiryDateMiddleware)
      .forRoutes('vouchers'); // Apply middleware to routes related to vouchers
  }
}
