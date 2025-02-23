import { model, Schema } from "mongoose";

interface IAuthToken {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  refresh_token_expires_in: number;
  expiry_date: number;
}

interface IUser {
  userId: String;
  tokens: IAuthToken;
}

const UserSchema = new Schema<IUser>({
  userId: {
    required: true,
    type: String,
  },
  tokens: {
    required: true,
    type: Object,
  },
});

const User = model<IUser>("user", UserSchema);

export default User;
