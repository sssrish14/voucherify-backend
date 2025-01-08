import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateExpiryDateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { expiryDate } = req.body;

    if (new Date(expiryDate) < new Date()) {
      throw new BadRequestException('Voucher expiry date must be in the future.');
    }

    next();
  }
}
