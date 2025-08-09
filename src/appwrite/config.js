import { Client, Databases, ID,Query } from "appwrite";
import conf from "../conf/conf";

// Initialize Appwrite client
const client = new Client();
const databases = new Databases(client);

client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

/**
 * Generic create function for any collection
 */
const createDocument = async (data, collectionId) => {
  try {
    const response = await databases.createDocument(
      conf.appWriteDatabaseId,
      collectionId,
      ID.unique(),
      data
    );
    console.log(`✅ Document created in ${collectionId}:`, response);
    return response;
  } catch (error) {
    console.error(`❌ createDocument error in ${collectionId}:`, error);
    throw error;
  }
};

/**
 * Generic get all documents from a collection
 */
const getDocuments = async (collectionId, queries = []) => {
  try {
    const response = await databases.listDocuments(
      conf.appWriteDatabaseId,
      collectionId,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error(`❌ getDocuments error in ${collectionId}:`, error);
    throw error;
  }
};

/**
 * Get a single document
 */
const getDocument = async (collectionId, documentId) => {
  try {
    return await databases.getDocument(
      conf.appWriteDatabaseId,
      collectionId,
      documentId
    );
  } catch (error) {
    console.error(`❌ getDocument error in ${collectionId}:`, error);
    throw error;
  }
};

/**
 * Update a document
 */
const updateDocument = async (collectionId, documentId, updatedData) => {
  try {
    return await databases.updateDocument(
      conf.appWriteDatabaseId,
      collectionId,
      documentId,
      updatedData
    );
  } catch (error) {
    console.error(`❌ updateDocument error in ${collectionId}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 */
const deleteDocument = async (collectionId, documentId) => {
  try {
    return await databases.deleteDocument(
      conf.appWriteDatabaseId,
      collectionId,
      documentId
    );
  } catch (error) {
    console.error(`❌ deleteDocument error in ${collectionId}:`, error);
    throw error;
  }
};

/**
 * getting list of post according to user
 */
const getListingsByUser = async (userId, collectionId, queries = []) => {
  try {
    const response = await databases.listDocuments(
      conf.appWriteDatabaseId,
      collectionId,
      queries // Pass the queries to filter by userId
    );
    return response.documents;
  } catch (error) {
    console.error(`❌ getListingsByUser error in ${collectionId}:`, error);
    throw error;
  }
};

const listingService = {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  getListingsByUser
};
export default listingService;