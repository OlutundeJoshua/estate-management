import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/models/dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  getAllusers(
    @Req() request: Request,
    @Query('email') email: string,
    @Query('type') type: string,
  ) {
    return this.service.getAllUsers(email, type);
  }

  @Get(':email')
  getUserByEmail(@Param() params: any) {
    return this.service.getUserByEmail(params.email);
  }

  @Post()
  async createuser(@Body() createUserDto: CreateUserDto) {
    return this.service.createUser(createUserDto);
  }

  @Post('approve-user')
  async approveUser(@Body() user) {
    return this.service.approveUser(user);
  }
}
