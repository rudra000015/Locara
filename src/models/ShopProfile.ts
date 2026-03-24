import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IShopProfile extends Document {
  shopId: string;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  address?: string;
  category?: string;
  tags?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ShopProfileSchema = new Schema<IShopProfile>(
  {
    shopId: { type: String, required: true, unique: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

export const ShopProfile = (models.ShopProfile || model<IShopProfile>("ShopProfile", ShopProfileSchema)) as mongoose.Model<IShopProfile>;
