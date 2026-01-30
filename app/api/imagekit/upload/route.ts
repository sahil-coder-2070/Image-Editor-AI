import { auth } from "@clerk/nextjs/server";
import Imagekit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
const imagekit = new Imagekit({
  publicKey: process.env.NEXT_PUBLIC_IMAGE_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const formData: FormData = await request.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file Provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timeStamp = Date.now();
    const formatFileName =
      typeof fileName === "string"
        ? fileName?.replace(/[^a-zA-Z0-9.-]/g, "_")
        : "upload";

    const uniqueFileName = `${userId}/${timeStamp}_${formatFileName}`;

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: uniqueFileName,
      folder: "/project",
    });

    const thumbnailUrl = imagekit.url({
      src: uploadResponse.url,
      transformation: [
        {
          width: 400,
          height: 300,
          cropMode: "maintain_ar",
          quality: 80,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      thumbnailUrl: thumbnailUrl,
      filedId: uploadResponse.fileId,
      width: uploadResponse.width,
      height: uploadResponse.height,
      size: uploadResponse.size,
      name: uploadResponse.name,
    });
  } catch (error: unknown) {
    console.error("Imagekit upload error", error);
    return NextResponse.json({
      success: false,
      error: "Failed to upload image",
      details: (error as Error).message,
    });
  }
}
