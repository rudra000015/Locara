import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export interface AuthPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export function requireAuth(request: NextRequest): AuthPayload {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
