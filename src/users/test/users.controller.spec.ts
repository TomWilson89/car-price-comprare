import { Test, TestingModule } from '@nestjs/testing';
import { datatype, internet } from 'faker';
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

  test('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('list()', () => {
    test('should return all users returnd by usersService.list function', async () => {
      const user = {
        id: datatype.uuid(),
        email: internet.email(),
        password: internet.password(),
      };
      mockUsersService.list.mockResolvedValue([user]);

      const users = await sut.list(user.email);

      expect(users).toBeDefined();
      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('email');
      expect(users[0].email).toBe(user.email);
    });
  });

  describe('find()', () => {
    test('should return single user returnd by usersService.find function', async () => {
      const mockUser = {
        id: datatype.uuid(),
        email: internet.email(),
        password: internet.password(),
      };
      mockUsersService.find.mockResolvedValue(mockUser);

      const user = await sut.find(mockUser.id);

      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user.email).toBe(mockUser.email);
    });

    test('should throw exception if no user is returns by usersService.find', async () => {
      const promise = sut.find(internet.email());

      await expect(promise).rejects.toThrowError('User not found');
    });
  });

  describe('signin()', () => {
    test('should add user id to session object and return a user', async () => {
      const session = { userId: null };
      const mockUser = {
        id: datatype.uuid(),
        email: internet.email(),
        password: internet.password(),
      };
      mockAuthService.signin.mockResolvedValue(mockUser);

      const user = await sut.signin(mockUser, session);

      expect(user).toBeDefined();
      expect(user.id).toBe(mockUser.id);
      expect(session.userId).toBe(mockUser.id);
    });
  });

  describe('signup()', () => {
    test('should add user id to session object and return a user', async () => {
      const session = { userId: null };
      const mockUser = {
        id: datatype.uuid(),
        email: internet.email(),
        password: internet.password(),
      };
      mockAuthService.signup.mockResolvedValue(mockUser);

      const user = await sut.signup(mockUser, session);

      expect(user).toBeDefined();
      expect(user.id).toBe(mockUser.id);
      expect(session.userId).toBe(mockUser.id);
    });
  });

  describe('logout()', () => {
    test('should set userId property to null i session object', () => {
      const session = { userId: datatype.uuid() };

      sut.logout(session);

      expect(session.userId).toBeNull();
    });
  });

  describe('me()', () => {
    test('should return a user object', () => {
      const mockUser = {
        id: datatype.uuid(),
        email: internet.email(),
        password: internet.password(),
      };

      const user = sut.me(mockUser);

      expect(user).toBeDefined();
      expect(user.id).toBe(mockUser.id);
    });
  });

  describe('update()', () => {
    test('should return a user object', async () => {
      const mockUser = {
        id: datatype.uuid(),
        email: internet.email(),
        password: internet.password(),
      };
      mockUsersService.update.mockResolvedValue(mockUser);

      const user = await sut.update(mockUser.id, mockUser);

      expect(user).toBeDefined();
      expect(user.id).toBe(mockUser.id);
    });
  });

  describe('remove()', () => {
    test('should return a user object', async () => {
      const mockUser = {
        id: datatype.uuid(),
        email: internet.email(),
        password: internet.password(),
      };
      mockUsersService.remove.mockResolvedValue(mockUser);

      const user = await sut.remove(mockUser.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(mockUser.id);
    });
  });
});
