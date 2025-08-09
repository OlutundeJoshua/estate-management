import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../models/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockResolvedValue({}),
};

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return users if found', async () => {
      const users = [{ emailAddress: 'test@example.com' }];
      mockUserRepository.find = jest.fn().mockResolvedValue(users);

      const result = await service.getAllUsers('test@example.com', 'admin');

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result.code).toBe(0);
    });

    it('should return an error if no users found', async () => {
      mockUserRepository.find = jest.fn().mockResolvedValue([]);

      const result = await service.getAllUsers('notfound@example.com', 'admin');

      expect(result).toMatchObject({ message: 'User not found' });
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        emailAddress: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        password: 'password123',
      };

      mockUserRepository.find = jest.fn().mockResolvedValue(null);
      mockUserRepository.save = jest.fn().mockResolvedValue({});

      bcrypt.hash.mockResolvedValue('hashedPassword');

      const result = await service.createUser(createUserDto);

      expect(userRepository.save).toHaveBeenCalled();
      expect(result.message).toBe('User created successfully');
    });

    it('should return error if user already exists', async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockResolvedValue({ emailAddress: 'test@example.com' });

      const result = await service.createUser({
        emailAddress: 'test@example.com',
      } as CreateUserDto);

      expect(result).toMatchObject({
        message: 'User with email address already exists!',
      });
    });
  });

  describe('approveUser', () => {
    it('should approve a user successfully', async () => {
      const user = { userId: '123', approved: 0 };
      mockUserRepository.findOne = jest.fn().mockResolvedValue(user);

      const result = await service.approveUser({ userId: '123' });

      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        approved: 1,
      });
      expect(result.message).toBe('User approved successfully');
    });

    it('should return an error if user already approved', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue({ userId: '123', approved: 1 });

      const result = await service.approveUser({ userId: '123' });

      expect(result).toMatchObject({ message: 'User already approved!' });
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const result = await service.hashPassword('password123');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result).toBe('hashedPassword');
    });
  });

  describe('verifyPassword', () => {
    it('should verify a password successfully', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.verifyPassword('password123', 'hashedPassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result).toBe(true);
    });
  });
});
