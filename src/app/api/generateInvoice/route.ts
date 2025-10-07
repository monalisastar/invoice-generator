import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // ✅ named import
import { guestRateLimiter } from "@/lib/rateLimiter";

// Define the shape of your user session
interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  hasPaid?: boolean;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Identify guest by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  if (!session) {
    // Guest access
    const allowed = guestRateLimiter(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          message: "Please sign up with Google to continue generating invoices.",
          redirect: "/auth/login?next=/invoice",
        },
        { status: 403 }
      );
    }
    // Guest allowed to generate invoice
    return NextResponse.json({ message: "Invoice generated (guest)" });
  }

  // Logged-in user: safely typecast
  const user = session.user as UserSession;

  if (!user.hasPaid) {
    return NextResponse.json(
      {
        message: "You need to pay via Bitcoin to generate invoices.",
        redirect: "/subscribe",
      },
      { status: 402 }
    );
  }

  // Paid user: generate invoice
  return NextResponse.json({ message: "Invoice generated (paid user)" });
}
