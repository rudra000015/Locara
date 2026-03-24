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

    const { shopId, reviewId, text } = await req.json();

    if (!shopId || !reviewId || !text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDb();
    const review = await ReviewModel.findOne({ _id: reviewId, shopId });
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    review.ownerReply = {
      text,
      repliedAt: new Date().toISOString(),
    };

    await review.save();
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('[POST /api/reviews/reply] error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}