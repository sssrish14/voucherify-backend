import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { SigninResponse } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Signup a new user.
   * @param email - User's email
   * @param password - User's password
   * @returns Created user
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async signup(email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({ email, password: hashedPassword });
    return {
      message: 'User created successfully',
      userId: newUser._id.toString(),
    };
  }

  /**
   * Signin an existing user.
   * @param email - User's email
   * @param password - User's password
   * @returns User's ID and success message
   */
  async signin(email: string, password: string): Promise<SigninResponse> {

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Please enter the correct details');
    }

    return {
      message: 'Login successful',
      userId: user._id.toString()
    };
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
