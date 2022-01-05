import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signup(email: string, password: string) {
    const user = await this.userService.find({ email });
    console.log(`user`, user);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    const newUser = await this.userService.create(email, result);
    return newUser;
  }
}
