import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { MongoDBModule } from './mongodb/mongodb.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoDBModule,
    UserModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
