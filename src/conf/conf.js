const conf = {
  appWriteUrl: import.meta.env.VITE_APPWRITE_ENDPOINT,
  appWriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appWriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  appWriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  appWriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  appWriteCollectionIdRooms: import.meta.env.VITE_APPWRITE_ROOMS_ID,
  appWriteCollectionIdJobs: import.meta.env.VITE_APPWRITE_JOBS_ID,
  appWriteCollectionIdMarket: import.meta.env.VITE_APPWRITE_MARKET_ID,
};

export default conf;
