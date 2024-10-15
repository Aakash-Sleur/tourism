import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Restaurant from "@/models/restaurants.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const restaurants = await Restaurant.find();
    return NextResponse.json(restaurants);
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
    const newHotel = new Restaurant({
      name,
      description,
      location,
      timing,
      banner,
    });
    await newHotel.save();

    return NextResponse.json(newHotel);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
