import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await connectDB();
    const user = await User.findById(id);
    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
