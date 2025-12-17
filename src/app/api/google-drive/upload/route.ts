import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3";
const GOOGLE_DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Starting Google Drive upload...");

    // 1. Verificar sesión
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      console.error("❌ No session or access token");
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    console.log("✅ Session valid");

    // 2. Obtener datos del request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    console.log("📄 File:", fileName, "Size:", file?.size);

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "File and fileName are required" },
        { status: 400 }
      );
    }

    // 3. Buscar o crear carpeta "SparkPlan"
    console.log("📁 Finding/creating folder...");
    const folderId = await findOrCreateFolder(
      "SparkPlan",
      session.accessToken
    );
    console.log("✅ Folder ID:", folderId);

    // 4. Subir archivo a Drive
    console.log("📤 Uploading file to Drive...");
    const fileId = await uploadFileToDrive(
      file,
      fileName,
      folderId,
      session.accessToken
    );
    console.log("✅ File uploaded:", fileId);

    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

    return NextResponse.json({
      success: true,
      fileId,
      fileUrl,
      message: "File saved successfully to Google Drive in SparkPlan folder",
    });
  } catch (error) {
    console.error("❌ Google Drive upload error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to upload file to Google Drive" },
      { status: 500 }
    );
  }
}

async function findOrCreateFolder(
  folderName: string,
  accessToken: string
): Promise<string> {
  try {
    console.log(`🔍 Searching for folder: ${folderName}`);
    
    const searchUrl = new URL(`${GOOGLE_DRIVE_API}/files`);
    searchUrl.searchParams.append(
      "q",
      `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
    );
    searchUrl.searchParams.append("fields", "files(id, name)");

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error("❌ Search error:", errorData);
      throw new Error(`Failed to search for folder: ${JSON.stringify(errorData)}`);
    }

    const searchData = await searchResponse.json();
    console.log("🔍 Search result:", searchData);

    if (searchData.files && searchData.files.length > 0) {
      console.log("✅ Folder exists:", searchData.files[0].id);
      return searchData.files[0].id;
    }

    console.log("📁 Creating new folder...");
    const createResponse = await fetch(`${GOOGLE_DRIVE_API}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error("❌ Create folder error:", errorData);
      throw new Error(`Failed to create folder: ${JSON.stringify(errorData)}`);
    }

    const createData = await createResponse.json();
    console.log("✅ Folder created:", createData.id);
    return createData.id;
  } catch (error) {
    console.error("❌ Error in findOrCreateFolder:", error);
    throw error;
  }
}

async function uploadFileToDrive(
  file: File,
  fileName: string,
  folderId: string,
  accessToken: string
): Promise<string> {
  try {
    console.log("📤 Converting file to buffer...");
    const fileBuffer = await file.arrayBuffer();
    console.log("✅ Buffer size:", fileBuffer.byteLength);

    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: "application/pdf",
    };

    console.log("📋 Metadata:", metadata);

    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataPart = delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata);

    console.log("📤 Converting to base64...");
    const filePart = delimiter +
      "Content-Type: application/pdf\r\n" +
      "Content-Transfer-Encoding: base64\r\n\r\n" +
      Buffer.from(fileBuffer).toString("base64");

    const multipartBody = metadataPart + filePart + closeDelimiter;
    console.log("📤 Multipart body size:", multipartBody.length);

    console.log("🚀 Uploading to Google Drive API...");
    const uploadResponse = await fetch(
      `${GOOGLE_DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      }
    );

    console.log("📥 Upload response status:", uploadResponse.status);

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("❌ Upload error:", errorData);
      throw new Error(`Failed to upload file: ${JSON.stringify(errorData)}`);
    }

    const uploadData = await uploadResponse.json();
    console.log("✅ Upload successful:", uploadData);
    return uploadData.id;
  } catch (error) {
    console.error("❌ Error in uploadFileToDrive:", error);
    throw error;
  }
}