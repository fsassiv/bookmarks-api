import { UserModel } from './user.schema';

export const emailValidator = async (email: string) => {
  const user = await new UserModel().findOne({ email });
  return !user;
};

export const validationMessages = {
  emailAlreadyExists: 'Email already exists',
};
