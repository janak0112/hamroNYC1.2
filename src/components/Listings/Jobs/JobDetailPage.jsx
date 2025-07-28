// pages/jobs/JobDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, Databases } from "appwrite";
import conf from "../../../conf/conf";
import JobDetailContent from "./JobDetailContent";
import { getImageUrl } from "../../../utils/uploadFile"; // Adjust the path if needed

const client = new Client()
  .setEndpoint(conf.appWriteUrl)
  .setProject(conf.appWriteProjectId);
const databases = new Databases(client);

function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await databases.getDocument(
          conf.appWriteDatabaseId,
          conf.appWriteCollectionIdJobs,
          id
        );
        setJob(res);

        // Assuming the image file ID is stored in `res.imageId`
        if (res.imageIds) {
          let url = getImageUrl(res.imageIds);
          setImageUrl(url);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load job.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error || !job)
    return (
      <p className="text-center p-8 text-red-500">
        {error || "Job not found."}
      </p>
    );

  return <JobDetailContent job={job} imageUrl={imageUrl} />;
}

export default JobDetailPage;
