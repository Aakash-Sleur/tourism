import mongoose, { Document, Schema } from "mongoose";

interface HotelDocument extends Document {
  name: string;
  description: string;
  location: string;
  timing: {
    start: string;
    end: string;
  };
  banner: string;
}

const HotelSchema: Schema<HotelDocument> = new Schema({
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

const Hotel =
  mongoose.models.Hotel || mongoose.model<HotelDocument>("Hotel", HotelSchema);
export default Hotel;
