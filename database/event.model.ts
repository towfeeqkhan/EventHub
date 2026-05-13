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
  date: string;
  time: string;
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
    date: nonEmptyString,
    time: nonEmptyString,
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

function normalizeDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date format");
  }

  return parsed.toISOString();
}

function normalizeTime(value: string): string {
  const trimmed = value.trim();
  const twentyFourHour = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (twentyFourHour.test(trimmed)) {
    return trimmed;
  }

  const twelveHour = /^(\d{1,2}):([0-5]\d)\s*([AaPp][Mm])$/;
  const match = trimmed.match(twelveHour);
  if (!match) {
    throw new Error("Invalid time format");
  }

  const rawHours = Number.parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toLowerCase();
  if (rawHours < 1 || rawHours > 12) {
    throw new Error("Invalid time format");
  }

  const hours24 = (rawHours % 12) + (period === "pm" ? 12 : 0);
  return `${String(hours24).padStart(2, "0")}:${minutes}`;
}

eventSchema.pre("validate", function handleEventValidation(this: EventDocument) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }
});

eventSchema.pre("save", function handleEventSave(this: EventDocument) {
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

eventSchema.index({ slug: 1 }, { unique: true });

export const Event =
  (models.Event as EventModel) ||
  model<EventDocument, EventModel>("Event", eventSchema);
