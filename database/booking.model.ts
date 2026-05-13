import {
  Schema,
  model,
  models,
  type Model,
  type Document,
  type Types,
} from "mongoose";
import { Event } from "./event.model";

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

bookingSchema.pre(
  "save",
  async function handleBookingSave(this: BookingDocument) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error("Referenced event does not exist");
    }
  },
);

export const Booking =
  (models.Booking as BookingModel) ||
  model<BookingDocument, BookingModel>("Booking", bookingSchema);
