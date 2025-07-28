import { Client, Databases, ID, Query } from "appwrite"; // Add Query for filtering
import conf from "../conf/conf";

// Initialize Appwrite client and Databases
const client = new Client();
const databases = new Databases(client);

client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

// Create a listing with userId
export const createListing = async ({
  title,
  description,
  category,
  price,
  location,
  contact,
  imageIds = null,
  userId,
}) => {
  try {
    const response = await databases.createDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      ID.unique(),
      {
        title,
        description,
        category,
        price,
        location,
        contact,
        imageIds,
        userId, // Add userId to the document
      }
    );
    console.log("✅ Listing created:", response);
    return response;
  } catch (error) {
    console.error("❌ createListing error:", error);
    throw error;
  }
};

export const createListings = async (data) => {
  try {
    const response = await databases.createDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionIdRooms,
      ID.unique(),
      data
    );
    console.log("✅ Listing created:", response);
    return response;
  } catch (error) {
    console.error("❌ createListing error:", error);
    throw error;
  }
};

export const createJobListing = async (data) => {
  try {
    const response = await databases.createDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionIdJobs,
      ID.unique(),
      data
    );
    console.log("✅ Listing created:", response);
    return response;
  } catch (error) {
    console.error("❌ createListing error:", error);
    throw error;
  }
};

export const createMarketListing = async (data) => {
  try {
    const response = await databases.createDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionIdMarket,
      ID.unique(),
      data
    );
    console.log("✅ Listing created:", response);
    return response;
  } catch (error) {
    console.error("❌ createListing error:", error);
    throw error;
  }
};

// Get all listings (optionally filter by userId)
export const getListings = async () => {
  try {
    const response = await databases.listDocuments(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionIdRooms
    );
    return response.documents;
  } catch (error) {
    console.error("❌ getListings error:", error);
    throw error;
  }
};

// Get single listing by ID
export const getListing = async (listingId) => {
  try {
    const response = await databases.getDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionIdRooms,
      listingId
    );
    return response.documents;
  } catch (error) {
    console.error("❌ getListing error:", error);
    throw error;
  }
};

// Update a listing
export const updateListing = async (listingId, updatedData) => {
  try {
    return await databases.updateDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      listingId,
      updatedData // userId can be included in updatedData if needed
    );
  } catch (error) {
    console.error("❌ updateListing error:", error);
    throw error;
  }
};

// Delete a listing
export const deleteListing = async (listingId) => {
  try {
    return await databases.deleteDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      listingId
    );
  } catch (error) {
    console.error("❌ deleteListing error:", error);
    throw error;
  }
};

const listingService = {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  createListings,
  createJobListing,
  createMarketListing,
};
export default listingService;
