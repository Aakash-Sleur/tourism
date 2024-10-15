"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user.model";

export const register = async (values: any) => {
  const { email, password, username, ...rest } = values;

  try {
    await connectDB();
    const userFound = await User.findOne({ email });

    if (userFound) {
      return {
        error: "Email already exists!",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      ...rest,
    });
    await user.save();
  } catch (error) {
    console.error(error);
  }
};
