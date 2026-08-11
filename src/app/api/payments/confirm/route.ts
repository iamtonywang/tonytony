import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      paymentId: null,
      orderId: null,
      message: "결제 서비스 준비 중입니다.",
      errors: null,
      code: "payments_not_ready",
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
