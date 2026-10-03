import { sql } from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`SELECT NOW() AS time`;

    return Response.json({
      success: true,
      message: "Kết nối Neon thành công",
      time: result[0].time,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Không kết nối được Neon",
      },
      { status: 500 }
    );
  }
}