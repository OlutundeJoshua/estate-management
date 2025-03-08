import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';

const mockUsersService = {
  getAllUsers: jest.fn(),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  approveUser: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllusers', () => {
    it('should call service.getAllUsers with email and type', () => {
      const email = 'test@example.com';
      const type = 'admin';
      controller.getAllusers({} as any, email, type);
      expect(mockUsersService.getAllUsers).toHaveBeenCalledWith(email, type);
    });
  });

  describe('getUserByEmail', () => {
    it('should call service.getUserByEmail with email', () => {
      const email = 'test@example.com';
      controller.getUserByEmail({ email });
      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('createuser', () => {
    it('should call service.createUser with CreateUserDto', async () => {
      const createUserDto: CreateUserDto = {
        emailAddress: 'test@example.com',
        username: 'Test User',
        password: 'Test Password',
        lastName: 'last Name',
        firstName: 'first name',
      };
      await controller.createuser(createUserDto);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('approveUser', () => {
    it('should call service.approveUser with user object', async () => {
      const user = { email: 'test@example.com', approved: true };
      await controller.approveUser(user);
      expect(mockUsersService.approveUser).toHaveBeenCalledWith(user);
    });
  });
});
