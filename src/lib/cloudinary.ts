import { v2 as cloudinary } from "cloudinary";
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload files to Cloudinary
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUri,
      { resource_type: "auto", folder: "ieee-summer-school" }, 
      (error, result) => {
        if (error) {
          console.log("error", error);
          reject(error);
        }
        else {
          console.log("result", result);
          resolve(result?.secure_url || "");
        }
      }
    );
  });
};