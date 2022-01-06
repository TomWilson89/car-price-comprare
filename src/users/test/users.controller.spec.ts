import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { AuthService } from '../auth.service';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let sut: UsersController;
  let mockUsersService: MockProxy<UsersService>;
  let mockAuthService: MockProxy<AuthService>;

  beforeEach(async () => {
    mockUsersService = mock();
    mockAuthService = mock();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    sut = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
