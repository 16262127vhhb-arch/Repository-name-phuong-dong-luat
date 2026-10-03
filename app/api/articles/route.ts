import {
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function getStorageKey(imageUrl: string | null) {
  if (!imageUrl) return null;

  try {
    const bucket = process.env.S3_BUCKET_NAME!;
    const url = new URL(imageUrl);
    const prefix = `/${bucket}/`;

    if (!url.pathname.startsWith(prefix)) {
      return null;
    }

    const key = url.pathname.substring(prefix.length);

    return key || null;
  } catch {
    return null;
  }
}

async function deleteStorageImage(imageUrl: string | null) {
  const key = getStorageKey(imageUrl);

  if (!key) return;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
    );
  } catch (error) {
    console.error("DELETE STORAGE IMAGE ERROR:", error);
  }
}

/* =========================
   GET - LẤY DANH SÁCH BÀI VIẾT
   Công khai
========================= */

export async function GET() {
  try {
    const articles = await sql`
      SELECT
        id,
        title,
        slug,
        category,
        excerpt,
        content,
        image_url,
        published,
        featured,
        published_at,
        created_at,
        updated_at
      FROM articles
      ORDER BY created_at DESC
    `;

    return Response.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("GET ARTICLES ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể lấy danh sách bài viết",
      },
      { status: 500 }
    );
  }
}

/* =========================
   POST - TẠO BÀI VIẾT
   Yêu cầu đăng nhập
========================= */

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Bạn chưa đăng nhập quản trị",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      title,
      slug,
      category,
      excerpt,
      content,
      imageUrl,
      published,
      featured,
    } = body;

    if (!title || !slug || !category || !content) {
      return Response.json(
        {
          success: false,
          message: "Thiếu thông tin bắt buộc",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO articles (
        title,
        slug,
        category,
        excerpt,
        content,
        image_url,
        published,
        featured,
        published_at
      )
      VALUES (
        ${title},
        ${slug},
        ${category},
        ${excerpt || null},
        ${content},
        ${imageUrl || null},
        ${published || false},
        ${featured || false},
        ${published ? new Date() : null}
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      article: result[0],
    });
  } catch (error) {
    console.error("POST ARTICLE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể lưu bài viết",
      },
      { status: 500 }
    );
  }
}

/* =========================
   PUT - CẬP NHẬT BÀI VIẾT
   Yêu cầu đăng nhập
========================= */

export async function PUT(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Bạn chưa đăng nhập quản trị",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      id,
      title,
      slug,
      category,
      excerpt,
      content,
      imageUrl,
      published,
      featured,
    } = body;

    const articleId = Number(id);

    if (!articleId || Number.isNaN(articleId)) {
      return Response.json(
        {
          success: false,
          message: "ID bài viết không hợp lệ",
        },
        { status: 400 }
      );
    }

    if (!title || !slug || !category || !content) {
      return Response.json(
        {
          success: false,
          message: "Thiếu thông tin bắt buộc",
        },
        { status: 400 }
      );
    }

    const oldResult = await sql`
      SELECT
        id,
        title,
        image_url
      FROM articles
      WHERE id = ${articleId}
      LIMIT 1
    `;

    if (oldResult.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Không tìm thấy bài viết",
        },
        { status: 404 }
      );
    }

    const oldArticle = oldResult[0];

    const hasNewImage =
      imageUrl &&
      imageUrl !== oldArticle.image_url;

    const result = await sql`
      UPDATE articles
      SET
        title = ${title},
        slug = ${slug},
        category = ${category},
        excerpt = ${excerpt || null},
        content = ${content},
        image_url = ${imageUrl || null},
        published = ${published ?? true},
        featured = ${featured ?? false},
        published_at = CASE
          WHEN ${published ?? true} = true
            THEN COALESCE(published_at, NOW())
          ELSE NULL
        END,
        updated_at = NOW()
      WHERE id = ${articleId}
      RETURNING *
    `;

    if (hasNewImage && oldArticle.image_url) {
      await deleteStorageImage(oldArticle.image_url);
    }

    return Response.json({
      success: true,
      message: "Cập nhật bài viết thành công",
      article: result[0],
    });
  } catch (error) {
    console.error("PUT ARTICLE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể cập nhật bài viết",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE - XÓA BÀI VIẾT
   Yêu cầu đăng nhập
========================= */

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Bạn chưa đăng nhập quản trị",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return Response.json(
        {
          success: false,
          message: "ID bài viết không hợp lệ",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT
        id,
        title,
        image_url
      FROM articles
      WHERE id = ${id}
      LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Không tìm thấy bài viết",
        },
        { status: 404 }
      );
    }

    const article = result[0];

    if (article.image_url) {
      await deleteStorageImage(article.image_url);
    }

    await sql`
      DELETE FROM articles
      WHERE id = ${id}
    `;

    return Response.json({
      success: true,
      message: "Xóa bài viết thành công",
      article: {
        id: article.id,
        title: article.title,
      },
    });
  } catch (error) {
    console.error("DELETE ARTICLE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể xóa bài viết",
      },
      { status: 500 }
    );
  }
}