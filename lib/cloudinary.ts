const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
}

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    // For MVP demo without Cloudinary configured
    console.log("Cloudinary not configured. File:", file.name);
    return {
      url: `demo://label-${Date.now()}`,
      publicId: `demo-${Date.now()}`,
      format: file.type.split("/")[1] || "pdf",
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "return-it/labels");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
  };
}

export function isValidFileType(file: File): boolean {
  const validTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  return validTypes.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
