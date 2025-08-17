import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../models/dto/create-user.dto';
import {
  customErrorResponseWithCode,
  customSuccessResponseWithCode,
} from '../models/lib/response.model';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  private readonly log = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async getAllUsers(email, type) {
    const filter = [];

    if (email) {
      filter.push({ emailAddress: Like(`%${email}%`) });
    }

    if (type) {
      filter.push({ type: Like(`%${type}%`) });
    }

    const users = await this.usersRepository.find({
      where: filter.length > 0 ? filter : undefined,
    });

    if (!users?.length) {
      return customErrorResponseWithCode('User not found');
    }

    const userResponse = users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.userId,
      emailAddress: user.emailAddress,
    }));

    return customSuccessResponseWithCode('Users retrieved successfully', userResponse);
  }

  async getUserByEmail(emailAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { emailAddress },
    });
    if (!user) {
      return customErrorResponseWithCode('User not found');
    }

    const userResponse = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.userId,
    };
    return customSuccessResponseWithCode('Users retrieved successfully', userResponse);
  }

  async createUser(createuserDto: CreateUserDto) {
    if (!createuserDto?.emailAddress) {
      return customErrorResponseWithCode('invalid user information');
    }
    const existingUser = await this.usersRepository.findOne({
      where: { emailAddress: createuserDto.emailAddress },
    });
    if (existingUser) {
      return customErrorResponseWithCode('User with email address already exists!');
    }

    this.log.debug('createuserDto', createuserDto);

    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const userId = parseInt(`${timestamp}${randomNumber}`.slice(0, 10));
    this.log.debug('creating user with Id', userId);
    const user: User = new User();
    user.userId = userId.toString();
    user.firstName = createuserDto.firstName;
    user.lastName = createuserDto.lastName;
    user.emailAddress = createuserDto.emailAddress;
    user.username = createuserDto.username;
    user.phoneNumber = createuserDto.phoneNumber;
    if (createuserDto.type) {
      user.type = createuserDto.type;
    }
    if (createuserDto.promotionConsent) {
      user.promotionConsent = 1;
    }
    const hashedPassword = await this.hashPassword(createuserDto.password);
    user.password = hashedPassword;
    try {
      await this.usersRepository.save(user);
      return customSuccessResponseWithCode('User created successfully', null);
    } catch (err) {
      this.log.error('error creating user', err);
      return customErrorResponseWithCode('Unable to create user.');
    }
  }

  async approveUser(userInfo) {
    try {
      const user = await this.usersRepository.findOne({
        where: { userId: userInfo.userId },
      });

      if (!user) return customErrorResponseWithCode('User not found');
      if (+user.approved === 1) {
        return customErrorResponseWithCode('User already approved!');
      }

      user.approved = 1;

      await this.usersRepository.save(user);
      return customSuccessResponseWithCode('User approved successfully', null);
    } catch (err) {
      this.log.debug('error approving user ', err);
      return customErrorResponseWithCode('Unable to approve user');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async findUserEntityByEmail(emailAddress: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { emailAddress } });
  }

  async saveUserEntity(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
