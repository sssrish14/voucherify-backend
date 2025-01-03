import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/voucherdb'), // Replace with your MongoDB connection string
    UserModule,
    VoucherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
