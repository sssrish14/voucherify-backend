import { Controller, Post, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service'; // Assuming UserService is available

import { CreateUserDto } from 'src/user/dto/create-user.dto';  // Your DTO for user data

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly userService: UserService,  // To check user existence
  ) {}

  // User Signup (Registration)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    // Assuming your userService handles password hashing and user creation
    const newUser = await this.userService.signup(createUserDto.email, createUserDto.password);
    
    return {
      message: 'User created successfully',
      userId: newUser.userId,
    };
  }

  // User Signin (Login)
  @Post('signin')
  async signin(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.signin(createUserDto.email, createUserDto.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Generate JWT token after successful login
    
    const token = this.authService.generateToken({email: createUserDto.email, userId: user.userId});
    
    return {
      message: 'Login successful',
      userId: user.userId, 
      token,  // Include the token in the response
    };
  }

  // Token verification (optional)
  @Post('verify')
  verifyToken(@Body('token') token: string) {
    const decoded = this.authService.verifyToken(token);
    if (decoded) {
      return { message: 'Token is valid', decoded };
    }
    return { message: 'Invalid or expired token' };
  }
}
