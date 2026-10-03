import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

/**
 * GET
 * Lấy danh sách yêu cầu liên hệ cho trang quản trị.
 */
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

    const contacts = await sql`
      SELECT
        id,
        name,
        phone,
        email,
        message,
        status,
        created_at
      FROM contact_messages
      ORDER BY created_at DESC
    `;

    return Response.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(
      "CONTACT GET ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Không thể tải danh sách liên hệ.",
      },
      { status: 500 }
    );
  }
}


/**
 * POST
 * Nhận yêu cầu liên hệ từ website.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!name) {
      return Response.json(
        {
          success: false,
          message:
            "Vui lòng nhập họ và tên.",
        },
        { status: 400 }
      );
    }

    if (!message) {
      return Response.json(
        {
          success: false,
          message:
            "Vui lòng nhập nội dung cần hỗ trợ.",
        },
        { status: 400 }
      );
    }

    if (name.length > 200) {
      return Response.json(
        {
          success: false,
          message:
            "Họ và tên quá dài.",
        },
        { status: 400 }
      );
    }

    if (phone.length > 50) {
      return Response.json(
        {
          success: false,
          message:
            "Số điện thoại không hợp lệ.",
        },
        { status: 400 }
      );
    }

    if (email.length > 200) {
      return Response.json(
        {
          success: false,
          message:
            "Email quá dài.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return Response.json(
        {
          success: false,
          message:
            "Nội dung liên hệ không được vượt quá 5.000 ký tự.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO contact_messages (
        name,
        phone,
        email,
        message
      )
      VALUES (
        ${name},
        ${phone || null},
        ${email || null},
        ${message}
      )
      RETURNING
        id,
        name,
        phone,
        email,
        message,
        status,
        created_at
    `;

    return Response.json({
      success: true,
      message:
        "Gửi yêu cầu liên hệ thành công.",
      contact: result[0],
    });
  } catch (error) {
    console.error(
      "CONTACT POST ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Không thể gửi yêu cầu. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}


/**
 * PATCH
 * Cập nhật trạng thái yêu cầu liên hệ.
 */
export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        {
          success: false,
          message:
            "Bạn không có quyền thực hiện thao tác này.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);
    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : "";

    if (!Number.isInteger(id) || id <= 0) {
      return Response.json(
        {
          success: false,
          message: "ID không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "new",
      "read",
      "replied",
    ];

    if (!allowedStatuses.includes(status)) {
      return Response.json(
        {
          success: false,
          message:
            "Trạng thái không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE contact_messages
      SET status = ${status}
      WHERE id = ${id}
      RETURNING
        id,
        name,
        phone,
        email,
        message,
        status,
        created_at
    `;

    if (result.length === 0) {
      return Response.json(
        {
          success: false,
          message:
            "Không tìm thấy yêu cầu liên hệ.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message:
        "Cập nhật trạng thái thành công.",
      contact: result[0],
    });
  } catch (error) {
    console.error(
      "CONTACT PATCH ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Không thể cập nhật trạng thái.",
      },
      { status: 500 }
    );
  }
}


/**
 * DELETE
 * Xóa yêu cầu liên hệ.
 */
export async function DELETE(request: Request) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return Response.json(
        {
          success: false,
          message:
            "Bạn không có quyền thực hiện thao tác này.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return Response.json(
        {
          success: false,
          message: "ID không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM contact_messages
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json(
        {
          success: false,
          message:
            "Không tìm thấy yêu cầu liên hệ.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message:
        "Đã xóa yêu cầu liên hệ.",
    });
  } catch (error) {
    console.error(
      "CONTACT DELETE ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Không thể xóa yêu cầu liên hệ.",
      },
      { status: 500 }
    );
  }
}