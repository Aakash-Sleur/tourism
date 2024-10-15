import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/reservation.model";
import Location from "@/models/location.model";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await connectDB();
    const reservation = await Reservation.find({ user: id }).populate({
      path: "location",
      model: Location,
    });
    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[RESERVATION_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
