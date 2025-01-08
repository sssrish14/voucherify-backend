import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from './jwt-payload.interface';  // Define the payload interface

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,  // Optional, for role-based guards
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; 
    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Verify token
      const decoded: JwtPayload = this.jwtService.verify(token, {
        secret: 'secret',  // Same secret as used in signing
      });
      request.user = decoded; // Attach decoded user info to the request object
      return true;
    } catch (error) {
        console.log(JSON.stringify(error))
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
