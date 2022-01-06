import { BadRequestException, Injectable } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async signup(email: string, password: string) {
    const user = await this.userService.find({ email });
    if (user) throw new BadRequestException('User already exists');
    const encryptedPassword = await this.encryptionService.encrypt(password);
    const newUser = await this.userService.create(email, encryptedPassword);
    return newUser;
  }

  async signin(email: string, password: string) {
    const user = await this.userService.find({ email });
    if (!user) throw new BadRequestException('Invalid credentials');
    if (!(await this.encryptionService.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
