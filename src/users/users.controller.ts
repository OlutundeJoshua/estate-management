import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllusers(@Req() request: Request, @Query('email') email: string, @Query('type') type: string) {
    return this.service.getAllUsers(email, type);
  }

  @UseGuards(JwtAuthGuard)
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
