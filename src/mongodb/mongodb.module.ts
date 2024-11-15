import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongooseConfigService } from './mongodb-config.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDBModule {
  private readonly logger = new Logger(MongoDBModule.name);

  constructor() {
    // mongoose.set('debug', true);

    mongoose.connection.on('connected', () => {
      this.logger.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      this.logger.error('Error connecting to MongoDB', err);
    });

    mongoose.connection.on('disconnected', () => {
      this.logger.warn('Disconnected from MongoDB');
    });
  }
}
