import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, Databases } from "appwrite";
import conf from "../../../conf/conf";
import { getImageUrls } from "../../../utils/uploadFile"; // Adjust the path if needed
import RoomDetailContent from "./RoomDetailContent";

const client = new Client()
  .setEndpoint(conf.appWriteUrl)
  .setProject(conf.appWriteProjectId);
const databases = new Databases(client);

function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await databases.getDocument(
          conf.appWriteDatabaseId,
          conf.appWriteCollectionIdRooms,
          id
        );
        setRoom(res);

        // Convert imageIds into array of URLs
        if (res.imageIds) {
          const urls = getImageUrls(res.imageIds);
          setImageUrl(urls); // ✅ now an array of URLs
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error || !room)
    return (
      <p className="text-center p-8 text-red-500">
        {error || "Room not found."}
      </p>
    );

  console.log(room);

  return <RoomDetailContent room={room} imageUrl={imageUrl} />;
}

export default RoomDetailPage;
