import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Bank } from 'src/entities/bank.entity';
import { Images } from 'src/entities/image.entity';
import { Property } from 'src/entities/property.entity';
import { Location } from 'src/entities/location.entity';
import { Transactions } from 'src/entities/transaction.entity';

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
