import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3";
const GOOGLE_DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const SPARKPLAN_FOLDER_NAME = "SparkPlan";
const MULTIPART_BOUNDARY = "-------314159265358979323846";

interface GoogleDriveFile {
  id: string;
  name: string;
}

interface GoogleDriveSearchResponse {
  files: GoogleDriveFile[];
}

interface GoogleDriveUploadResponse {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await validateSession();
    const { file, fileName } = await extractFormData(request);
    
    const folderId = await ensureSparkPlanFolderExists(session.accessToken!);
    const fileId = await uploadPdfToFolder(file, fileName, folderId, session.accessToken!);
    
    return buildSuccessResponse(fileId);
  } catch (error) {
    return handleUploadError(error);
  }
}

async function validateSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    throw new Error("Unauthorized. Please sign in.");
  }
  
  return session;
}

async function extractFormData(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const fileName = formData.get("fileName") as string;

  if (!file || !fileName) {
    throw new Error("File and fileName are required");
  }

  return { file, fileName };
}

async function ensureSparkPlanFolderExists(accessToken: string): Promise<string> {
  const existingFolder = await searchForFolder(SPARKPLAN_FOLDER_NAME, accessToken);
  
  if (existingFolder) {
    return existingFolder.id;
  }
  
  return await createFolder(SPARKPLAN_FOLDER_NAME, accessToken);
}

async function searchForFolder(
  folderName: string,
  accessToken: string
): Promise<GoogleDriveFile | null> {
  const searchUrl = buildFolderSearchUrl(folderName);
  
  const response = await fetch(searchUrl.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  await throwIfResponseNotOk(response, "Failed to search for folder");

  const data: GoogleDriveSearchResponse = await response.json();
  
  return data.files?.[0] || null;
}

function buildFolderSearchUrl(folderName: string): URL {
  const url = new URL(`${GOOGLE_DRIVE_API}/files`);
  const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  
  url.searchParams.append("q", query);
  url.searchParams.append("fields", "files(id, name)");
  
  return url;
}

async function createFolder(folderName: string, accessToken: string): Promise<string> {
  const response = await fetch(`${GOOGLE_DRIVE_API}/files`, {
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

  await throwIfResponseNotOk(response, "Failed to create folder");

  const data: GoogleDriveUploadResponse = await response.json();
  
  return data.id;
}

async function uploadPdfToFolder(
  file: File,
  fileName: string,
  folderId: string,
  accessToken: string
): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const multipartBody = buildMultipartBody(fileName, folderId, fileBuffer);
  
  const response = await fetch(
    `${GOOGLE_DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${MULTIPART_BOUNDARY}`,
      },
      body: multipartBody,
    }
  );

  await throwIfResponseNotOk(response, "Failed to upload file");

  const data: GoogleDriveUploadResponse = await response.json();
  
  return data.id;
}

function buildMultipartBody(
  fileName: string,
  folderId: string,
  fileBuffer: ArrayBuffer
): string {
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: "application/pdf",
  };

  const delimiter = `\r\n--${MULTIPART_BOUNDARY}\r\n`;
  const closeDelimiter = `\r\n--${MULTIPART_BOUNDARY}--`;

  const metadataPart = 
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata);

  const base64Content = Buffer.from(fileBuffer).toString("base64");
  const filePart = 
    delimiter +
    "Content-Type: application/pdf\r\n" +
    "Content-Transfer-Encoding: base64\r\n\r\n" +
    base64Content;

  return metadataPart + filePart + closeDelimiter;
}

async function throwIfResponseNotOk(response: Response, errorMessage: string): Promise<void> {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("DRIVE_PERMISSION_DENIED");
    }
    const errorData = await response.json();
    throw new Error(`${errorMessage}: ${JSON.stringify(errorData)}`);
  }
}

function buildSuccessResponse(fileId: string): NextResponse {
  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

  return NextResponse.json({
    success: true,
    fileId,
    fileUrl,
    message: "File saved successfully to Google Drive in SparkPlan folder",
  });
}

function handleUploadError(error: unknown): NextResponse {
  const errorMessage = error instanceof Error ? error.message : "Failed to upload file to Google Drive";

  if (errorMessage === "DRIVE_PERMISSION_DENIED") {
    return NextResponse.json({ error: "DRIVE_PERMISSION_DENIED" }, { status: 403 });
  }

  const statusCode = errorMessage.includes("Unauthorized") ? 401 : 500;
  return NextResponse.json({ error: errorMessage }, { status: statusCode });
}