import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

export const generateHash = async (password: string) =>
  await bcrypt.hash(password, await bcrypt.genSalt());

export const isPasswordMatch = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);

export const clearAuthResponse = (
  data: UserDocument &
    User &
    Required<{
      _id: unknown;
    }> & {
      __v: number;
    },
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hash, _id, __v, ...rest } = data?.toJSON();
  return { ...rest, id: _id } as UserDocument;
};

export const validationMessages = {
  emailAlreadyExists: 'Email already exists',
  askForValidEmail: 'Please enter a valid email address',
};
