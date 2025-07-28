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


export function getImageUrls(imageIds) {
  const ENDPOINT = conf.appWriteUrl; // e.g. https://nyc.cloud.appwrite.io/v1
  const PROJECT_ID = conf.appWriteProjectId;
  const BUCKET_ID = conf.appWriteBucketId; // make sure this is set in conf.js

  // If it's already an array, use it directly
  const ids = Array.isArray(imageIds)
    ? imageIds
    : typeof imageIds === "string"
    ? imageIds.split(",")
    : [];

  // Map each fileId to full Appwrite view URL
  return ids.map((id) => {
    const cleanId = id.trim();
    if (cleanId.startsWith("http")) {
      return cleanId; // already a full URL
    }
    return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${cleanId}/view?project=${PROJECT_ID}`;
  });
}


