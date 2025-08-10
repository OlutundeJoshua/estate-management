import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Bank } from '../entities/bank.entity';
import { Images } from '../entities/image.entity';
import { Location } from '../entities/location.entity';
import { Property } from '../entities/property.entity';
import { Transactions } from '../entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bank, Images, Location, Property, Transactions])],

  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
