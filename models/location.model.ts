import mongoose, { Schema, Document } from "mongoose";

// Define the schema for a Location
export interface LocationDocument extends Document {
  name: string;
  description: string;
  location: string;
  price: string;
  bestTime: string;
  hours: string;
  rating: number;
  imageUrl: [string];
  attractions: string[];
  nearbyPlaces: string[];
  hotels?: Document[];
  restaurants?: Document[];
}

const LocationSchema: Schema<LocationDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    bestTime: {
      type: String,
      required: [true, "Best time is required"],
    },
    hours: {
      type: String,
      required: [true, "Operating hours are required"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: [true, "Rating is required"],
      default: 0,
    },
    imageUrl: {
      type: [String],
      required: [true, "Image URL is required"],
    },
    attractions: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 0,
        "At least one attraction is required",
      ],
    },
    nearbyPlaces: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 0,
        "At least one nearby place is required",
      ],
    },
    hotels: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Hotel",
    },
    restaurants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Restaurant",
    },
  },
  {
    timestamps: true,
  }
);

const Location =
  mongoose.models.Location ||
  mongoose.model<LocationDocument>("Location", LocationSchema);

export default Location;
