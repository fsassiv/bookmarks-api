// src/health/health.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class HealthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.userModel.findOne();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
