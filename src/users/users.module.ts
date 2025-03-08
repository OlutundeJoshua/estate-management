import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Bank } from '../entities/bank.entity';
import { Images } from '../entities/image.entity';
import { Property } from '../entities/property.entity';
import { Location } from '../entities/location.entity';
import { Transactions } from '../entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Bank,
      Images,
      Location,
      Property,
      Transactions,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
