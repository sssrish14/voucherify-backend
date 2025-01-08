import { Controller, Post, Body, NotFoundException, BadRequestException, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/Auth/auth.service';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.userService.signup(createUserDto.email, createUserDto.password);

    return {
      message: 'User created successfully',
      userId: newUser.userId.toString(),  // Return userId as string
    };
  }
  @Post('signin')
  async signin(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.signin(createUserDto.email, createUserDto.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const token = this.authService.generateToken({ email: createUserDto.email, userId: user.userId });

    return {
      
      token,
    };
  }

  @Get()
  async getAllUsers() {
    const user = await this.userService.findAllUsers();
    if (!user || user.length === 0) {
      throw new NotFoundException('No users found');
    }

  }
}
