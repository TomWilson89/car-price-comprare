import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';

describe('AuthService', () => {
  let sut: AuthService;
  let mockUsersService: MockProxy<UsersService>;

  beforeEach(async () => {
    mockUsersService = mock();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    sut = module.get<AuthService>(AuthService);
    mockUsersService.find.mockResolvedValue(null);
  });

  test('should create an instance of auth service', async () => {
    expect(sut).toBeDefined();
  });

  test('should create an instance of auth service', async () => {
    const user = {
      id: 'any_id',
      email: 'any@email.com',
      password: '123456',
    };
    mockUsersService.find.mockResolvedValueOnce(user);
    const promise = sut.signup('', '');

    await expect(promise).rejects.toThrow('User already exists');
  });
});

// ANOTHER APPROACH BY MOCKING Repository
// export type MockType<T> = {
//   [P in keyof T]?: jest.Mock<Record<string, unknown>>;
// };

// jest.mock('../users.service');
// const repositoryMockFactory: () => MockType<Repository<User>> = jest.fn(
//   () => ({}),
// );

// describe('AuthService', () => {
//   let sut: AuthService;
//   let usersService: UsersService;
//   let repositoryMock: MockType<Repository<User>>;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         UsersService,
//         {
//           provide: getRepositoryToken(User),
//           useFactory: repositoryMockFactory,
//         },
//       ],
//     }).compile();

//     sut = module.get<AuthService>(AuthService);
//     usersService = module.get<UsersService>(UsersService);
//     repositoryMock = module.get(getRepositoryToken(User));
//   });

//   test('should create an instance of auth service', async () => {
//     expect(sut).toBeDefined();
//   });

//   test('should create an instance of auth service', async () => {
//     jest
//       .spyOn(usersService, 'find')
//       .mockResolvedValueOnce({ email: '', id: '', password: '' });

//     const promise = sut.signup('', '');

//     await expect(promise).rejects.toThrow('User already exists');
//   });
// });
