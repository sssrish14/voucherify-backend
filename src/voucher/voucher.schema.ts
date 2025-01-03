import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Voucher extends Document {
  @Prop({ required: true })
  voucherName: string;

  @Prop({ required: true, unique: true })
  voucherCode: string;

  @Prop({ enum: ['percentage', 'amount'], required: true })
  discountType: string;

  @Prop({ required: true })
  discountValue: number;

  @Prop({ required: true })
  minAmount: number;

  @Prop({ required: true })
  maxAmount: number;

  @Prop({ required: true })
  activationDate: Date;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ type: [String], default: [] })
  userEmails: string[];

  @Prop({ required: true, default: false })
  isRepeated: boolean;

  @Prop({ required: true }) 
  userId: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
