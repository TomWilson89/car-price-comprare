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
  Session,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }
  // @Get('me')
  // me(@Session() session: any) {
  //   return this.usersService.find({ id: session.userId });
  // }

  @Post('logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Post('signup')
  async signup(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
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
