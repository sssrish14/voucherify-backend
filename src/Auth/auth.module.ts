import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './JWT/jwt.strategy';
import { JwtAuthGuard } from './JWT/jwt-auth.guard';
import { UserModule } from '../user/user.module'; 
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || '!@#$%^12345as#$sdsd#$',
      signOptions: { expiresIn: '1h' }, 
    }),
    forwardRef(() => UserModule), 
  ],
  providers: [JwtStrategy, JwtAuthGuard, AuthService],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
