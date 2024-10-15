import User from "@/models/user.model";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  try {
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
