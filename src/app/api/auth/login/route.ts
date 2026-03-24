import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectDb();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Unable to login" }, { status: 500 });
  }
}
