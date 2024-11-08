import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { emailValidator, validationMessages } from './utils';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: validationMessages.emailAlreadyExists,
    },
  })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type IUserModel = Model<UserDocument>;

export const UserModel = Model<UserDocument>;
