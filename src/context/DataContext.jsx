// context/DataContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { Client, Databases, Storage, Query, Teams } from "appwrite";
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

  // NEW: split by moderation status
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [unapprovedPosts, setUnapprovedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  const client = new Client().setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);
  const databases = new Databases(client);
  const storage = new Storage(client);
  const teams = new Teams(client);

  const userIsAdmin = useCallback(async (teamId) => {
    try {
      const res = await teams.listMemberships(teamId);
      return res.memberships?.some((m) => m.roles?.includes("admin")) || false;
    } catch {
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
    const adminTeamId = conf.appWriteTeamsId;
    const ok = u && adminTeamId ? await userIsAdmin(adminTeamId) : false;
    setIsAdmin(!!ok);
  }, [userIsAdmin]);

  // status: "approved" | "unapproved" | "pending" | "all"
  const listByCollection = async (collectionId, status = "approved") => {
    const queries = [Query.orderDesc("$createdAt")];
    if (status === "approved") queries.push(Query.equal("approvedByAdmin", true));
    if (status === "unapproved") queries.push(Query.equal("approvedByAdmin", false));
    if (status === "pending") {
      // Works on Appwrite ≥1.3
      queries.push(Query.isNull("approvedByAdmin"));
      // If you're on older Appwrite without isNull, remove the line above
      // and filter client-side after fetching "all".
    }
    return databases.listDocuments(conf.appWriteDatabaseId, collectionId, queries);
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const showOnlyApproved = !adminMode; // public: approved only; admin: split all
      const approved = [];
      const unapproved = [];
      const pending = [];

      for (const col of collectionIds) {
        if (showOnlyApproved) {
          const a = await listByCollection(col.id, "approved");
          const map = a.documents.map((d) => ({ ...d, type: col.type, collectionId: col.id }));
          approved.push(...map);
        } else {
          // admin mode: fetch 3 buckets in parallel
          const [a, u, p] = await Promise.all([
            listByCollection(col.id, "approved"),
            listByCollection(col.id, "unapproved"),
            listByCollection(col.id, "pending"),
          ]);

          const map = (docs) => docs.map((d) => ({ ...d, type: col.type, collectionId: col.id }));
          approved.push(...map(a.documents));
          unapproved.push(...map(u.documents));
          pending.push(...map(p.documents));

          // ---- Fallback if your Appwrite doesn't support isNull ----
          // const all = await databases.listDocuments(conf.appWriteDatabaseId, col.id, [Query.orderDesc("$createdAt")]);
          // const mapped = all.documents.map((d) => ({ ...d, type: col.type, collectionId: col.id }));
          // approved.push(...mapped.filter(d => d.approvedByAdmin === true));
          // unapproved.push(...mapped.filter(d => d.approvedByAdmin === false));
          // pending.push(...mapped.filter(d => d.approvedByAdmin === undefined || d.approvedByAdmin === null));
        }
      }

      // Public view shows approved only in the existing arrays you already consume
      setPosts(showOnlyApproved ? approved : [...approved, ...unapproved, ...pending]);

      setJobs(approved.filter((d) => d.type === "jobs"));
      setRooms(approved.filter((d) => d.type === "rooms"));
      setMarket(approved.filter((d) => d.type === "market"));
      setEvents(approved.filter((d) => d.type === "events"));
      setTravelCompanion(approved.filter((d) => d.type === "travelCompanion"));

      // NEW: expose buckets for admin screens
      setApprovedPosts(approved);
      setUnapprovedPosts(unapproved);
      setPendingPosts(pending);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [adminMode]);

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

  const handleDeleteDocument = async (collectionId, documentId) => {
    await databases.deleteDocument(conf.appWriteDatabaseId, collectionId, documentId);
    await fetchAllData();
  };

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  return (
    <DataContext.Provider
      value={{
        // existing
        posts, jobs, rooms, market, events, travelCompanion,
        loading, error, authUser, fetchAllData,
        approveDocument, declineDocument, handleDeleteDocument,
        adminMode, setAdminMode, isAdmin,

        // NEW buckets for admin UI
        approvedPosts, unapprovedPosts, pendingPosts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
