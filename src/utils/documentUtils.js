// utils/createDocumentWithToast.js
import listingService from "../appwrite/config";
import { showSuccessToast, showErrorToast } from "./toastHandler";

export const createDocumentWithToast = async (
  data,
  collectionId,
  navigate,
  path = "/"
) => {
  try {
    const response = await listingService.createDocument(data, collectionId);
    showSuccessToast("Successfully created!");

    if (navigate && path) {
      setTimeout(() => navigate(path), 1000);
    }

    return response;
  } catch (error) {
    console.error("Document creation error:", error);
    showErrorToast(error.message || "Failed to create document.");
    return null;
  }
};
