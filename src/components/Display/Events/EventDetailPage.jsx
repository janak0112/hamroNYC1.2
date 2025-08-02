import React, { useEffect, useState } from "react";
import EventDetailContent from "./EventDetailContent";
import { useParams } from "react-router-dom";
import { Client, Databases } from "appwrite";
import { getImageUrls } from "../../../utils/uploadFile";
import { getUserById } from "../../../appwrite/auth";
import conf from "../../../conf/conf";

const client = new Client()
  .setEndpoint(conf.appWriteUrl)
  .setProject(conf.appWriteProjectId);
const databases = new Databases(client);

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await databases.getDocument(
          conf.appWriteDatabaseId,
          conf.appWriteCollectionIdEvents,
          id
        );
        setEvent(res);

        // Convert imageIds into array of URLs
        if (res.imageIds) {
          const urls = getImageUrls(res.imageIds);
          setImageUrl(urls); // ✅ now an array of URLs
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error || !event)
    return (
      <p className="text-center p-8 text-red-500">
        {error || "Event not found."}
      </p>
    );

  return <EventDetailContent event={event} imageUrl={imageUrl} />;
}

export default EventDetailPage;
