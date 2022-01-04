import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  @Post('signup')
  create(@Body() { email, password }: CreateUserDto) {
    console.log(`email`, email);
    console.log(`password`, password);
  }
}
