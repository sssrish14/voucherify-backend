import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 
import { UserService } from 'src/user/user.service'; // Import UserService for validation

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,  
    private readonly userService: UserService 
  ) {
    this.userService = userService
  }

  
 
  generateToken(user:{email: string, userId: string}): string {
    const payload = { email: user.email, userId: user.userId };
    // const payload = {email: "srishti"}
    console.log("payload", payload);
    
    return this.jwtService.sign(payload, { expiresIn: '1h', secret: "secret" }); 
  }

  verifyToken(token: string): any {
    try {
      const decoded = this.jwtService.decode(token);
      console.log(decoded); 
      return decoded;
    } catch (error) {
      return null; 
    }
  }
}

