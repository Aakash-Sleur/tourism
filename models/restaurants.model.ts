import mongoose, { Document, Schema } from "mongoose";

interface RestaurantDocument extends Document {
  name: string;
  description: string;
  location: string;
  timing: {
    start: string;
    end: string;
  };
  banner: string;
}

const RestaurantSchema: Schema<RestaurantDocument> = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  timing: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  banner: {
    type: String,
    required: true,
  },
});

const Restaurant =
  mongoose.models.Restaurant ||
  mongoose.model<RestaurantDocument>("Restaurant", RestaurantSchema);
export default Restaurant;
