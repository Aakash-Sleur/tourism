import { NextResponse } from "next/server";
import Hotel from "@/models/hotel.model";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectDB();
    const hotels = await Hotel.find();
    return NextResponse.json(hotels);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, location, timing, banner } = await req.json();

    if (!name || !description || !location || !timing || !banner) {
      return NextResponse.json("All fields are required", { status: 400 });
    }

    await connectDB();
    const newHotel = new Hotel({ name, description, location, timing, banner });
    await newHotel.save();
    return NextResponse.json(newHotel);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
