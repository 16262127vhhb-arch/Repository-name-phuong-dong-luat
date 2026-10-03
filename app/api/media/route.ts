import {
  DeleteObjectCommand,
  ListObjectsV2Command,
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

function getImageUrl(key: string) {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
  const bucket = process.env.S3_BUCKET_NAME!;

  return `${endpoint}/${bucket}/${key}`;
}

async function getUsedImageKeys() {
  const articles = await sql`
    SELECT id, image_url
    FROM articles
    WHERE image_url IS NOT NULL
  `;

  const usedKeys = new Map<string, number>();

  for (const article of articles) {
    if (!article.image_url) {
      continue;
    }

    try {
      const url = new URL(article.image_url);

      const bucket = process.env.S3_BUCKET_NAME!;
      const prefix = `/${bucket}/`;

      if (!url.pathname.startsWith(prefix)) {
        continue;
      }

      const key = url.pathname.substring(prefix.length);

      if (key) {
        usedKeys.set(key, article.id);
      }
    } catch {
      continue;
    }
  }

  return usedKeys;
}

export async function GET() {
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
    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME!,
        Prefix: "articles/",
      })
    );

    const usedImageKeys = await getUsedImageKeys();

    const files = (result.Contents || [])
      .filter((item) => item.Key)
      .map((item) => {
        const key = item.Key!;

        return {
          key,
          url: getImageUrl(key),
          size: item.Size || 0,
          lastModified: item.LastModified || null,
          used: usedImageKeys.has(key),
          articleId: usedImageKeys.get(key) || null,
        };
      })
      .sort((a, b) => {
        const dateA = a.lastModified
          ? new Date(a.lastModified).getTime()
          : 0;

        const dateB = b.lastModified
          ? new Date(b.lastModified).getTime()
          : 0;

        return dateB - dateA;
      });

    return Response.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("GET MEDIA ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể lấy thư viện ảnh",
      },
      { status: 500 }
    );
  }
}

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

    const key =
      typeof body.key === "string"
        ? body.key.trim()
        : "";

    if (!key) {
      return Response.json(
        {
          success: false,
          message: "Thiếu key của ảnh",
        },
        { status: 400 }
      );
    }

    if (!key.startsWith("articles/")) {
      return Response.json(
        {
          success: false,
          message: "Key ảnh không hợp lệ",
        },
        { status: 400 }
      );
    }

    const usedImageKeys = await getUsedImageKeys();

    if (usedImageKeys.has(key)) {
      const articleId = usedImageKeys.get(key);

      return Response.json(
        {
          success: false,
          message:
            `Ảnh đang được sử dụng trong bài viết ID ${articleId}. ` +
            "Hãy thay ảnh trong bài viết trước khi xóa.",
        },
        { status: 409 }
      );
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
    );

    return Response.json({
      success: true,
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    console.error("DELETE MEDIA ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể xóa ảnh",
      },
      { status: 500 }
    );
  }
}