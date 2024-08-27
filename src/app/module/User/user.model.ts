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
      required: [true, "Image is required"],
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
    address: {
      type: String,
      // required: [true, "Address is required"],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;

  // Validate that password and confirmPassword match
  if (user.isModified("password") && user.confirmPassword) {
    if (user.password !== user.confirmPassword) {
      throw new Error("Passwords do not match");
    }
  }

  // Hash the password if it has been modified (or is new)
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});
// set '' after saving password
userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
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
