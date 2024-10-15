import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/hotel.model";
import Location from "@/models/location.model";
import Restaurant from "@/models/restaurants.model";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const location = await Location.findById(params.id)
      .populate({
        path: "hotels",
        model: Hotel,
      })
      .populate({
        path: "restaurants",
        model: Restaurant,
      });

    return NextResponse.json(location);
  } catch (error) {
    console.log("[LOCATION_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const location = await Location.findByIdAndDelete(params.id);
    return NextResponse.json(location);
  } catch (error) {
    console.error("[LOCATION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
