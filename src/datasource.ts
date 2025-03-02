import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Bank } from './entities/bank.entity';
import { Images } from './entities/image.entity';
import { Location } from './entities/location.entity';
import { Property } from './entities/property.entity';
import { Transactions } from './entities/transaction.entity';

@Injectable()
export class DataSource implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'estate_management',
      synchronize: true,
      entities: [User, Bank, Images, Location, Property, Transactions],
    };
  }
}
