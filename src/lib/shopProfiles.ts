// src/lib/shopProfiles.ts
// Switch to MongoDB-backed panels

import { connectDb } from '@/lib/mongodb';
import { ShopProfile } from '@/models/ShopProfile';
import { ShopOwnerProfile } from '@/types/shop';

export async function getAllProfiles(): Promise<ShopOwnerProfile[]> {
  await connectDb();
  return ShopProfile.find().lean();
}

export async function getProfile(shopId: string): Promise<ShopOwnerProfile | null> {
  await connectDb();
  return ShopProfile.findOne({ shopId }).lean();
}

export async function saveProfile(shopId: string, profile: ShopOwnerProfile): Promise<void> {
  await connectDb();
  await ShopProfile.findOneAndUpdate(
    { shopId },
    { ...profile },
    { upsert: true, new: true }
  );
}

export async function deleteProfile(shopId: string): Promise<void> {
  await connectDb();
  await ShopProfile.deleteOne({ shopId });
}
