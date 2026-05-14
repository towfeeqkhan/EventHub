import { Schema, model, models, type Model, type Document } from "mongoose";

type EventAgenda = string[];
type EventTags = string[];

export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  startsAt: Date;
  mode: string;
  audience: string;
  agenda: EventAgenda;
  organizer: string;
  tags: EventTags;
  createdAt: Date;
  updatedAt: Date;
}

type EventModel = Model<EventDocument>;

const nonEmptyString = {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: (value: string) => value.trim().length > 0,
    message: "Field must be a non-empty string",
  },
};

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: nonEmptyString,
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: nonEmptyString,
    overview: nonEmptyString,
    image: nonEmptyString,
    venue: nonEmptyString,
    location: nonEmptyString,
    startsAt: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => !Number.isNaN(value.getTime()),
        message: "startsAt must be a valid date",
      },
    },
    mode: nonEmptyString,
    audience: nonEmptyString,
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item",
      },
    },
    organizer: nonEmptyString,
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item",
      },
    },
  },
  {
    timestamps: true,
  },
);

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

eventSchema.pre("validate", function handleEventValidation(this: EventDocument) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }
});

eventSchema.index({ slug: 1 }, { unique: true });

const existingEventModel = models.Event as EventModel | undefined;

if (process.env.NODE_ENV !== "production" && existingEventModel) {
  delete models.Event;
}

export const Event =
  process.env.NODE_ENV === "production" && existingEventModel
    ? existingEventModel
    : model<EventDocument, EventModel>("Event", eventSchema);
