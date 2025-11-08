import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("public_id");

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteFromCloudinary(publicId);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
