import { createContext, useState, useEffect, useCallback } from "react";
import { Client, Databases, Storage } from "appwrite";
import conf from "../conf/conf";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const client = new Client()
    .setEndpoint(conf.appWriteUrl)
    .setProject(conf.appWriteProjectId);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const collectionIds = [
    { type: "jobs", id: conf.appWriteCollectionIdJobs },
    { type: "rooms", id: conf.appWriteCollectionIdRooms },
    { type: "market", id: conf.appWriteCollectionIdMarket },
  ];

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
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <DataContext.Provider
      value={{
        posts, // all documents together
        jobs, // only jobs
        rooms, // only rooms
        market, // only market
        loading,
        error,
        fetchAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
