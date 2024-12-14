import cloudinary from "cloudinary";
import configKeys from "../../config";

cloudinary.v2.config({
  cloud_name: configKeys.CLOUDINARY_CLOUD_NAME,
  api_key: configKeys.CLOUDINARY_API_KEY,
  api_secret: configKeys.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "user_uploads",
          use_filename: true,
          unique_filename: true,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(new Error("Cloudinary upload failed"));
          }
          if (result) {
            return resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Error deleting image");
    }
  }
  async updateImage(
    file: Express.Multer.File,
    oldPublicId: string
  ): Promise<string> {
    try {
      await cloudinary.v2.uploader.destroy(oldPublicId);
      const result = await this.uploadImage(file);
      return result;
    } catch (error) {
      console.error("Error updating image:", error);
      throw new Error("Error updating image");
    }
  }

  async uploadPDF(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "pdf_uploads",
          resource_type: "raw",
          use_filename: true,
          unique_filename: true,
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            return reject(
              new Error("Cloudinary PDF upload failed: " + error.message)
            );
          }
          if (result) {
            return resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }
}
