import { createContext, useState, useEffect, useCallback } from "react";
import { Client, Databases, Storage, Account } from "appwrite";
import conf from "../conf/conf";
import { getCurrentUser } from "../appwrite/auth";
// import { deleteDocument } from "../appwrite/config"

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [market, setMarket] = useState([]);
  const [travelCompanion, setTravelCompanion] = useState([]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const client = new Client()
    .setEndpoint(conf.appWriteUrl)
    .setProject(conf.appWriteProjectId);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const collectionIds = [
    { type: "jobs", id: conf.appWriteCollectionIdJobs },
    { type: "rooms", id: conf.appWriteCollectionIdRooms },
    { type: "market", id: conf.appWriteCollectionIdMarket },
    { type: "events", id: conf.appWriteCollectionIdEvents },
    { type: "travelCompanion", id: conf.appWriteCollectionIdTravelC },
  ];

  // Fetch logged-in user via your auth helper
  const fetchUser = useCallback(async () => {
    const user = await getCurrentUser();
    if (user) {
      console.log("Logged in user:", user);
      setAuthUser(user.$id);
    } else {
      setAuthUser(null);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const result = [];

      for (const col of collectionIds) {
        const res = await databases.listDocuments(
          conf.appWriteDatabaseId,
          col.id
        );
        result.push(
          ...res.documents.map((doc) => ({ ...doc, type: col.type }))
        );
      }

      setPosts(result);
      setJobs(result.filter((doc) => doc.type === "jobs"));
      setRooms(result.filter((doc) => doc.type === "rooms"));
      setMarket(result.filter((doc) => doc.type === "market"));
      setEvents(result.filter((doc) => doc.type === "events"));
      setTravelCompanion(
        result.filter((doc) => doc.type === "travelCompanion")
      );
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE DOCUMENT

  const handleDeleteDocument = async (collectionId, documentId) => {
    try {
      await databases.deleteDocument(
        conf.appWriteDatabaseId,
        collectionId,
        documentId
      );
      console.log("✅ Document deleted:", documentId);
      await fetchAllData(); // Refresh data after deletion
    } catch (error) {
      console.error("❌ Error deleting document:", error);
      setError(error.message);
      throw error; // Optional: Rethrow to allow components to handle errors
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchUser();
  }, [fetchAllData, fetchUser]);

  return (
    <DataContext.Provider
      value={{
        posts, // all documents together
        jobs, // only jobs
        rooms, // only rooms
        market, // only market
        events, // only events
        loading,
        error,
        authUser,
        fetchAllData,
        travelCompanion,
        handleDeleteDocument,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
