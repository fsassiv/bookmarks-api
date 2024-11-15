import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAllUsers(): Promise<any> {
    const users: User[] = await this.userModel.find().lean().exec();
    const temp = users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash, ...rest } = user;
      return rest;
    });

    return temp;
  }
}
