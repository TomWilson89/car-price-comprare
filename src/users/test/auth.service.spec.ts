import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { AuthService } from '../auth.service';
import { EncryptionService } from '../encryption.service';
import { UsersService } from '../users.service';

describe('AuthService', () => {
  let sut: AuthService;
  let mockUsersService: MockProxy<UsersService>;
  let mockEncryptionService: MockProxy<EncryptionService>;

  beforeEach(async () => {
    mockUsersService = mock();
    mockEncryptionService = mock();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    sut = module.get<AuthService>(AuthService);
    mockUsersService.create.mockImplementation((email, password) =>
      Promise.resolve({
        email,
        password,
        id: '1',
      }),
    );
  });

  test('should create an instance of auth service', async () => {
    expect(sut).toBeDefined();
  });

  describe('signup', () => {
    beforeEach(() => {
      mockUsersService.find.mockResolvedValue(null);
      mockEncryptionService.encrypt.mockResolvedValue('salt.hash');
    });

    test('should throw an error if email is already in use', async () => {
      const user = {
        id: 'any_id',
        email: 'any@email.com',
        password: 'any_password',
      };
      mockUsersService.find.mockResolvedValueOnce(user);
      const promise = sut.signup('any@email.com', 'any_password');

      await expect(promise).rejects.toThrow('User already exists');
    });

    test('should create a new user with a salted and hashed password', async () => {
      const mockUser = {
        email: 'any@email.com',
        password: 'any_password',
      };

      const user = await sut.signup(mockUser.email, mockUser.password);
      const [salt, hash] = user.password.split('.');

      expect(salt).toBe('salt');
      expect(hash).toBe('hash');
      expect(user.email).toBe(user.email);
      expect(user.password).not.toBe(mockUser.password);
    });
  });

  describe('signin', () => {
    const mockUser = {
      email: 'any@email.com',
      password: 'any_password',
      id: '1',
    };

    beforeEach(() => {
      mockUsersService.find.mockResolvedValue(mockUser);
      mockEncryptionService.compare.mockResolvedValue(true);
    });

    test('should throw an error if invlaid email is provided', async () => {
      mockUsersService.find.mockResolvedValueOnce(null);

      const promise = sut.signin('wrong@email.com', 'any_password');

      await expect(promise).rejects.toThrow('Invalid credentials');
    });

    test('should throw an error if invlaid encryption.compare return false', async () => {
      mockEncryptionService.compare.mockResolvedValueOnce(false);
      const promise = sut.signin('wrong@email.com', 'any_password');

      await expect(promise).rejects.toThrow('Invalid credentials');
    });

    test('should return a user if valid credentials were provided', async () => {
      const user = await sut.signin('wrong@email.com', 'any_password');

      expect(user).toEqual(mockUser);
    });
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
