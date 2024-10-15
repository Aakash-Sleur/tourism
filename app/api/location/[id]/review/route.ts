import { connectDB } from "@/lib/mongodb";
import Location from "@/models/location.model";
import Review from "@/models/review.model";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await Review.find({ location: params.id }).populate({
      path: "user",
      model: User,
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, comment, rating } = await req.json();
    const locationId = params.id;

    if (!userId || !comment || !rating) {
      return NextResponse.json("All fields are required", { status: 400 });
    }

    await connectDB();
    const newComment = await Review.create({
      location: locationId,
      user: userId,
      comment,
      rating,
    });

    const totalReviews = await Review.countDocuments({ location: locationId });
    console.log(totalReviews);
    const totalRating = await Review.aggregate([
      { $match: { location: new mongoose.Types.ObjectId(locationId) } },
      { $group: { _id: null, totalRating: { $sum: "$rating" } } },
    ]);

    const avgRating =
      totalRating.length > 0 ? totalRating[0].totalRating / totalReviews : 0;

    await Location.findByIdAndUpdate(locationId, {
      rating: avgRating,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
