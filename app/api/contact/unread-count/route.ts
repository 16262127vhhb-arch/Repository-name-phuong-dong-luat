import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "Bạn không có quyền truy cập.",
        },
        { status: 401 }
      );
    }

    const result = await sql`
      SELECT COUNT(*)::int AS count
      FROM contact_messages
      WHERE status = 'new'
    `;

    return Response.json({
      success: true,
      count: result[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("CONTACT UNREAD COUNT ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể lấy số liên hệ chưa xem.",
      },
      { status: 500 }
    );
  }
}