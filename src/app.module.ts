import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TEntity } from './entities/t-entity';
import { User } from './entities/users.entity';
import { Bank } from './entities/bank.entity';
import { DataSource } from './datasource';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DataSource,
    }),
    UsersModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
