import { NextResponse } from "next/server";
import Location from "@/models/location.model";
import { connectDB } from "@/lib/mongodb";

// GET Method
export async function GET(req: Request) {
  try {
    await connectDB();

    const locations = await Location.find();

    return NextResponse.json(locations);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// POST Method
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      location,
      price,
      bestTime,
      hours,
      imageUrl,
      attractions,
      nearbyPlaces,
      hotels,
      restaurants,
    } = body;

    if (
      !name ||
      !description ||
      !location ||
      !price ||
      !bestTime ||
      !hours ||
      !imageUrl ||
      !attractions ||
      !nearbyPlaces ||
      !hotels ||
      !restaurants
    ) {
      return NextResponse.json("All fields are required", { status: 400 });
    }
    await connectDB();

    const newLocation = new Location({
      name,
      description,
      location,
      price,
      bestTime,
      hours,
      imageUrl,
      attractions,
      nearbyPlaces,
      hotels,
      restaurants,
    });

    await newLocation.save();
    return NextResponse.json(newLocation);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error" + error, { status: 500 });
  }
}

// PUT Method
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const {
      name,
      description,
      location,
      price,
      bestTime,
      hours,
      rating,
      imageUrl,
      attractions,
      nearbyPlaces,
    } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      {
        name,
        description,
        location,
        price,
        bestTime,
        hours,
        rating,
        imageUrl,
        attractions,
        nearbyPlaces,
      },
      { new: true }
    );

    if (!updatedLocation) {
      return NextResponse.json(
        { message: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
