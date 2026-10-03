import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
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
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "Không tìm thấy file ảnh",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        {
          success: false,
          message: "Chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return Response.json(
        {
          success: false,
          message: "Ảnh không được vượt quá 5MB",
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const key = `articles/${randomUUID()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
    const bucket = process.env.S3_BUCKET_NAME!;

    const imageUrl = `${endpoint}/${bucket}/${key}`;

    return Response.json({
      success: true,
      message: "Upload ảnh thành công",
      imageUrl,
      key,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Không thể upload ảnh",
      },
      { status: 500 }
    );
  }
}