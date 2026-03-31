import { useState, useCallback } from "react";

interface UseGoogleDriveReturn {
  uploadToDrive: (file: Blob, fileName: string) => Promise<{ fileId: string; fileUrl: string }>;
  isUploading: boolean;
  error: Error | null;
}

export function useGoogleDrive(): UseGoogleDriveReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadToDrive = useCallback(async (
    fileBlob: Blob,
    fileName: string
  ): Promise<{ fileId: string; fileUrl: string }> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      const file = new File([fileBlob], fileName, { type: "application/pdf" });
      formData.append("file", file);
      formData.append("fileName", fileName);

      const response = await fetch("/api/google-drive/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "DRIVE_UPLOAD_FAILED");
      }

      const data = await response.json();
      
      return {
        fileId: data.fileId,
        fileUrl: data.fileUrl,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      console.error("Google Drive upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadToDrive,
    isUploading,
    error,
  };
}