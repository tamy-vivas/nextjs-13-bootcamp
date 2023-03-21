import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get("authorization") as string;
  const errorResponse = new NextResponse(
    JSON.stringify({
      errorMessage: "Unauthorized request",
    }),
    { status: 401 }
  );

  if (!bearerToken) {
    return errorResponse;
  }
  const token: string = bearerToken.split(" ")[1];

  if (!token) {
    return errorResponse;
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return errorResponse;
  }
}

export const config = {
  matcher: ["/api/auth/me"],
};
