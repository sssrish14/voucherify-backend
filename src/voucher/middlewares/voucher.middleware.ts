import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateExpiryDateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { expiryDate } = req.body;
    
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Expiry date cannot be in the past' });
    }
    
    next();
  }
} 