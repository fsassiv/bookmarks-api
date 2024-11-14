import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserModel, User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: IUserModel) {}

  async createUser(name: string, email: string): Promise<User> {
    const newUser = new this.userModel({ name, email });
    return newUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }
}
