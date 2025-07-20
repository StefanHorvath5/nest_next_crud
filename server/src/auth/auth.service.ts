import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt/jwt.strategy';

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isMatch = (await bcrypt.compare(password, user.password)) as boolean;

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      items: user.items,
    };
  }

  login(user: SafeUser): { access_token: string } {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto): Promise<SafeUser> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const hashedPassword = (await bcrypt.hash(dto.password, 10)) as string;

    const newUser = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      items: newUser.items,
    };
  }
}
