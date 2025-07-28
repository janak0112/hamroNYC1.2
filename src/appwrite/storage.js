import { Client, Storage, ID } from "appwrite";
import conf from "../conf/conf";

// Initialize Appwrite Client and Storage
const client = new Client();
const storage = new Storage(client);

client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

// Upload file and return its ID
export const uploadFile = async (file) => {
  try {
    const response = await storage.createFile(
      conf.appWriteBucketId,
      ID.unique(),
      file
    );
    return response.$id;
  } catch (error) {
    console.error("uploadFile error:", error);
    throw error;
  }
};

// Get file preview URL
export const getFilePreview = (fileId, width = 600, height = 600) => {
  try {
    return storage.getFilePreview(conf.appWriteBucketId, fileId, width, height);
  } catch (error) {
    console.error("getFilePreview error:", error);
    return null;
  }
};

// Delete a file
export const deleteFile = async (fileId) => {
  try {
    return await storage.deleteFile(conf.appWriteBucketId, fileId);
  } catch (error) {
    console.error("deleteFile error:", error);
    throw error;
  }
};

export default {
  uploadFile,
  getFilePreview,
  deleteFile,
};
