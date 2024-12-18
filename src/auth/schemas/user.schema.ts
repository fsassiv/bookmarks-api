import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { validationMessages } from '../auth.util';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    match: [/.+@.+\..+/, validationMessages.askForValidEmail],
  })
  email: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  hash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel = Model<UserDocument>;
