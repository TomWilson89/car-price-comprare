import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() { email, password }: CreateUserDto) {
    return this.authService.signup(email, password);
  }

  @Post('signin')
  signin(@Body() { email, password }: CreateUserDto) {
    return this.authService.signin(email, password);
  }

  @Get('/:id')
  async find(@Param('id') id: string) {
    const user = await this.usersService.find({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  list(@Query('email') email: string) {
    return this.usersService.list(email);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() attrs: UpdateUserDto) {
    return this.usersService.update(id, attrs);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
