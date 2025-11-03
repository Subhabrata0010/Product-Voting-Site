export interface CloudinaryUploadResponse {
  url: string;
  public_id: string;
}

export const uploadToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDNAME;
  const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
  const folder = process.env.NEXT_PUBLIC_CLOUD_FOLDER;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing");
  }

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder || "");
  formData.append("cloud_name", cloudName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return {
    url: data.url,
    public_id: data.public_id,
  };
};