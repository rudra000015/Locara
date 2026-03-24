import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  shopId: string;
  userId: string;
  userName: string;
  userImg?: string;
  rating: number;
  title: string;
  body: string;
  tags: string[];
  helpful: number;
  helpfulBy: string[];
  verified: boolean;
  ownerReply?: {
    text: string;
    repliedAt: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shopId: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    userImg: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    helpful: { type: Number, default: 0 },
    helpfulBy: { type: [String], default: [] },
    verified: { type: Boolean, default: false },
    ownerReply: {
      text: { type: String, trim: true },
      repliedAt: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const Review = (models.Review || model<IReview>("Review", ReviewSchema)) as mongoose.Model<IReview>;
