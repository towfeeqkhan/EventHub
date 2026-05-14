import {
  Schema,
  model,
  models,
  type Model,
  type Document,
  type Types,
} from "mongoose";

export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingModel = Model<BookingDocument>;

const bookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email must be valid"],
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

export const Booking =
  (models.Booking as BookingModel) ||
  model<BookingDocument, BookingModel>("Booking", bookingSchema);
