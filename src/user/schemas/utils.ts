import { apiHandleRequest } from 'src/utils';
import { UserModel } from './user.schema';

export const emailValidator = async (email: string) => {
  const [error] = await apiHandleRequest(new UserModel().findOne({ email }));
  if (error) return false;
  return true;
};

export const validationMessages = {
  emailAlreadyExists: 'Email already exists',
  askForValidEmail: 'Please enter a valid email address',
};
