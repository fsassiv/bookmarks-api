import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { apiHandleRequest } from 'src/utils';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class HealthService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async checkDatabaseConnection(): Promise<boolean> {
    const [error] = await apiHandleRequest(this.UserModel.findOne());

    if (error) {
      return false;
    }

    return true;
  }
}
