import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserModel, User } from 'src/user/schemas/user.schema';
import { apiHandleRequest } from '../utils/request.utils';

import { clearAuthResponse, generateHash, isMatch } from './auth.util';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: IUserModel) {}

  async signUp(body: SignUpDto) {
    const newUser = new this.UserModel({
      ...body,
      hash: await generateHash(body.password),
    });

    const [error, data] = await apiHandleRequest(newUser.save());

    // @ts-expect-error - MongooseError - Duplicate Key
    if (error?.code === 11000) {
      throw new BadRequestException('Email already exists');
    }

    return clearAuthResponse(data);
  }

  async signIn(body: SignInDto) {
    const [error, data] = await apiHandleRequest(
      this.UserModel.findOne({ email: body.email }),
    );

    if (error) throw BadRequestException;

    if (!data) throw new NotFoundException();

    const doesPasswordMatch = await isMatch(body.password, data.hash);

    if (!doesPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return clearAuthResponse(data);
  }
}
