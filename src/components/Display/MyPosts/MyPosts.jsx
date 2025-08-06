import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import PostSection from "../../../pages/Home/Components/PostSection";

const MyPosts = () => {
    const { jobs, rooms, market, events, loading, error,authUser } =
        useContext(DataContext);

    const { slug } = useParams(); // ✅ get slug from URL
    const loggedInUserId = authUser; // Replace later with session user

    const [filtered, setFiltered] = useState({
        jobs: [],
        rooms: [],
        market: [],
        events: [],
    });

    const filterByUser = (list, userId) =>
        list?.filter(post => {
            try {
                return JSON.parse(post.postedBy).id === userId;
            } catch {
                return false;
            }
        }) || [];

    useEffect(() => {
        if (!loading && loggedInUserId) {
            setFiltered({
                jobs: filterByUser(jobs, loggedInUserId),
                rooms: filterByUser(rooms, loggedInUserId),
                market: filterByUser(market, loggedInUserId),
                events: filterByUser(events, loggedInUserId),
            });
        }
    }, [slug, jobs, rooms, market, events, loggedInUserId, loading]); 
    // ✅ re-run when slug changes

    if (loading) return <p>Loading...</p>;

    const items = [
        { data: filtered.jobs, title: "Jobs", link: "/jobs" },
        { data: filtered.rooms, title: "Rooms", link: "/rooms" },
        { data: filtered.market, title: "Market", link: "/market" },
        { data: filtered.events, title: "Events", link: "/events" },
    ];

    return (
        <div className="space-y-6 mt-10">
            {items.map(
                (item, i) =>
                    item.data.length > 0 && (
                        <PostSection
                            key={i}
                            title={`My ${item.title}`}
                            data={item.data}
                            loading={loading}
                            error={error}
                            link={`/my-posts/${item.link}`}
                        />
                    )
            )}
        </div>
    );
};

export default MyPosts;
