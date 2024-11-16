import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { apiHandleRequest } from '../utils/request.utils';
import { generateHash, isPasswordMatch } from './auth.util';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { RefreshToken } from './schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
  ) {}

  async signUp(body: SignUpDto) {
    const newUser = new this.UserModel({
      ...body,
      hash: await generateHash(body.password),
    });

    const [errorRegUser, registeredUser] = await apiHandleRequest(
      this.UserModel.findOne({ email: body.email }),
    );

    if (errorRegUser) throw new BadRequestException(errorRegUser);

    const [error, data] = await apiHandleRequest(newUser.save());

    // @ts-expect-error - MongooseError - Duplicate Key
    if (error?.code === 11000 || registeredUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.generateJwtToken(data.id);
  }

  async signIn(body: SignInDto) {
    const [error, data] = await apiHandleRequest(
      this.UserModel.findOne({ email: body.email }),
    );

    if (error) throw new BadRequestException('Something went wrong!');

    if (!data) throw new BadRequestException('Invalid credentials');

    const doesPasswordMatch = await isPasswordMatch(body.password, data.hash);

    if (!doesPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.generateJwtToken(data.id);
  }

  async generateJwtToken(
    userId: string,
  ): Promise<{ access_token: string; refreshToken: string; userId: string }> {
    const payload = {
      id: userId,
    };

    const refreshToken = uuidv4();
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    await this.storeRefreshToken(refreshToken, userId);

    return { access_token, refreshToken, userId };
  }

  async refreshToken(refreshToken: string) {
    const [error, data] = await apiHandleRequest(
      this.RefreshTokenModel.findOne({
        refreshToken,
        expiryDate: { $gte: new Date() },
      }),
    );

    if (error) {
      throw new BadRequestException();
    }

    if (!data) {
      throw new UnauthorizedException();
    }

    return this.generateJwtToken(data.userId.toString());
  }

  async storeRefreshToken(refreshToken: string, userId: string) {
    const expiryDate = new Date().setDate(new Date().getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, refreshToken } },
      {
        upsert: true,
      },
    );
  }
}
