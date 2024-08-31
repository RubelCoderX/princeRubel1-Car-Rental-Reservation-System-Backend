import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      // required: [true, "Address is required"],
    },
  },
  {
    timestamps: true,
  }
);

// hashed the password field
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});
// Static method to check if a user exists by
userSchema.statics.isUserExitsByEmail = async function (email: string) {
  return await User.findOne({ email });
};
// Static method to check if the password matches
userSchema.statics.isPasswordMatched = async function (
  palinTextPassword,
  hashedTextPassword
) {
  return await bcrypt.compare(palinTextPassword, hashedTextPassword);
};
export const User = model<TUser, UserModel>("User", userSchema);
