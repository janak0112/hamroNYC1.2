// context/DataContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { Client, Databases, Storage, Query,Teams } from "appwrite"; // ⬅️ add Query
import conf from "../conf/conf";
import { getCurrentUser } from "../appwrite/auth";

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

  const [isAdmin, setIsAdmin] = useState(false);

  // simple toggle; replace with real RBAC/team check later
  const [adminMode, setAdminMode] = useState(false);

  const client = new Client()
    .setEndpoint(conf.appWriteUrl)
    .setProject(conf.appWriteProjectId);

  const databases = new Databases(client)
  const storage = new Storage(client);

  const teams = new Teams(client);

  // Helper to check “am I in ADMIN team with role 'admin'?”
  const userIsAdmin = useCallback(async (teamId) => {
    try {
      const res = await teams.listMemberships(teamId);      // ⬅️ uses current user's session
      return res.memberships?.some(m => m.roles?.includes("admin")) || false;
    } catch (e) {
      // Non-members typically can’t read a team’s memberships → treat as not admin
      return false;
    }
  }, [teams]);

  const collectionIds = [
    { type: "jobs", id: conf.appWriteCollectionIdJobs },
    { type: "rooms", id: conf.appWriteCollectionIdRooms },
    { type: "market", id: conf.appWriteCollectionIdMarket },
    { type: "events", id: conf.appWriteCollectionIdEvents },
    { type: "travelCompanion", id: conf.appWriteCollectionIdTravelC },
  ];

  const fetchUser = useCallback(async () => {
    const u = await getCurrentUser();
    setAuthUser(u ? u.$id : null);

    const adminTeamId = conf.appWriteTeamsId
    const ok = u && adminTeamId ? await userIsAdmin(adminTeamId) : false;
    setIsAdmin(!!ok);
  }, [userIsAdmin]);

  const listByCollection = async (collectionId, onlyApproved) => {
    const queries = [Query.orderDesc("$createdAt")];
    // Optional: also require publish === true
    // queries.push(Query.equal("publish", true));
    if (onlyApproved) queries.push(Query.equal("approvedByAdmin", true));
    return databases.listDocuments(conf.appWriteDatabaseId, collectionId, queries);
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const onlyApproved = !adminMode; // public: approved only; admin: everything
      const result = [];

      for (const col of collectionIds) {
        const res = await listByCollection(col.id, onlyApproved);
        result.push(...res.documents.map((doc) => ({ ...doc, type: col.type })));
      }

      setPosts(result);
      setJobs(result.filter((d) => d.type === "jobs"));
      setRooms(result.filter((d) => d.type === "rooms"));
      setMarket(result.filter((d) => d.type === "market"));
      setEvents(result.filter((d) => d.type === "events"));
      setTravelCompanion(result.filter((d) => d.type === "travelCompanion"));
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [adminMode]);

  // Approve / Decline
  const approveDocument = async (collectionId, documentId) => {
    await databases.updateDocument(
      conf.appWriteDatabaseId,
      collectionId,
      documentId,
      { approvedByAdmin: true }
    );
    await fetchAllData();
  };

  const declineDocument = async (collectionId, documentId) => {
    await databases.updateDocument(
      conf.appWriteDatabaseId,
      collectionId,
      documentId,
      { approvedByAdmin: false }
    );
    await fetchAllData();
  };

  // Delete (unchanged)
  const handleDeleteDocument = async (collectionId, documentId) => {
    await databases.deleteDocument(conf.appWriteDatabaseId, collectionId, documentId);
    await fetchAllData();
  };

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  return (
    <DataContext.Provider
      value={{
        posts, jobs, rooms, market, events, travelCompanion,
        loading, error, authUser, fetchAllData,
        approveDocument, declineDocument, handleDeleteDocument,
        adminMode, setAdminMode,
        isAdmin,  
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
