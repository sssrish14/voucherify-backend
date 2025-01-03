import { Controller, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    return this.userService.signup(createUserDto.email, createUserDto.password);
  }

  @Post('signin')
  async signin(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.signin(createUserDto.email, createUserDto.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user._id, // Return the user ID for frontend use
      message: 'Login successful',
    };
  }
}
