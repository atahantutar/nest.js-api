import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });
      if (!user) {
        return { message: 'User not found' };
      } else {
        const isPasswordMatching = await bcrypt.compare(
          loginDto.password,
          user.password,
        );
        if (!isPasswordMatching) {
          return { message: 'Incorrect password' };
        } else {
          const payload = { email: user.email, sub: user.id };
          const token = this.jwtService.sign(payload);
          return { token };
        }
      }
    } catch (error) {
      return error.message;
    }
  }

  async register(reqisterDto: RegisterDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: reqisterDto.email },
      });
      if (user) {
        return { message: 'User already exists' };
      } else {
        const hashedPassword = await bcrypt.hash(reqisterDto.password, 10);
        const newUser = await this.userRepository.create({
          ...reqisterDto,
          password: hashedPassword,
        });
        await this.userRepository.save(newUser);
        return newUser;
      }
    } catch (error) {
      return error.message;
    }
  }
}
