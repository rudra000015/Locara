import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/mongodb';
import { Review as ReviewModel } from '@/models/Review';
import { requireAuth } from '@/middleware/auth';

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { shopId, reviewId } = await req.json();
    if (!shopId || !reviewId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDb();
    const review = await ReviewModel.findOne({ _id: reviewId, shopId });
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    const alreadyHelpful = review.helpfulBy.includes(user.id);
    if (alreadyHelpful) {
      review.helpful = Math.max(0, review.helpful - 1);
      review.helpfulBy = review.helpfulBy.filter((id) => id !== user.id);
    } else {
      review.helpful += 1;
      review.helpfulBy.push(user.id);
    }

    await review.save();
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('[POST /api/reviews/helpful] error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}