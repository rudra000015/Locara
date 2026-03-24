import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAuth } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const payload = requireAuth(request);

    if (!(payload as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth me error", error);
    if (error instanceof NextResponse) {
      return error;
    }
    return NextResponse.json({ error: "Unable to fetch authenticated user" }, { status: 500 });
  }
}
