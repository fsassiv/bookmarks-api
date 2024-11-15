import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomJwtOptionsFactory } from './jwt/jwt-options.factory';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      useClass: CustomJwtOptionsFactory,
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomJwtOptionsFactory, AuthGuard],
  exports: [JwtModule, AuthGuard],
})
export class AuthModule {}
