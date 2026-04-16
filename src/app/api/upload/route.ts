// src/app/api/upload/route.ts
// Handles both image and video uploads to Cloudinary
// Returns { url, publicId, type: "image" | "video" }

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth/helpers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/avi", "video/mov"];

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isVideo = VIDEO_TYPES.includes(file.type);
    const isImage = IMAGE_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Use JPG, PNG, WebP, MP4, or MOV.` },
        { status: 400 }
      );
    }

    // Size limits: 10MB images, 100MB videos
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${isVideo ? "100MB for videos" : "10MB for images"}.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadOptions: any = {
        folder: isVideo ? "lat-shop/videos" : "lat-shop/products",
        resource_type: isVideo ? "video" : "image",
      };

      if (isImage) {
        uploadOptions.transformation = [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto:good" },
          { format: "webp" },
        ];
      }

      if (isVideo) {
        uploadOptions.transformation = [
          { quality: "auto" },
          { format: "mp4" },
        ];
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (err, res) => { if (err) reject(err); else resolve(res); }
      ).end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      type: isVideo ? "video" : "image",
      width: result.width,
      height: result.height,
      duration: result.duration, // seconds, for videos
      format: result.format,
    });

  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message ?? "Upload failed" }, { status: 500 });
  }
}
