import { Client, Storage, ID } from "appwrite";
import conf from "../conf/conf"; // Adjust the path

const client = new Client()
  .setEndpoint(conf.appWriteUrl)
  .setProject(conf.appWriteProjectId);

const storage = new Storage(client);

/**
 * Uploads multiple images to Appwrite (max 5).
 * @param {FileList | File[]} files - Files selected from input
 * @returns {Promise<string[]>} - Array of uploaded file IDs
 */
const uploadImages = async (files) => {
  const validFiles = Array.from(files).slice(0, 5); // Max 5
  const fileIds = [];

  for (const file of validFiles) {
    try {
      const res = await storage.createFile(
        conf.appWriteBucketId,
        ID.unique(),
        file
      );
      fileIds.push(res.$id);
    } catch (err) {
      console.error(`Error uploading ${file.name}:`, err);
      throw err;
    }
  }

  return fileIds;
};

const getImageUrl = (fileId) => {
  return storage.getFileView(conf.appWriteBucketId, fileId);
};

export { uploadImages, getImageUrl };
