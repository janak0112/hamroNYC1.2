import React, { useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import CategoryTiles from "./../CategoriesTiles/CategoriesTiles";
import PostSection from "../../../pages/Home/Components/PostSection";
import Footer from "../../../pages/Home/Components/Footer";

const MyPosts = () => {
    const { jobs, rooms, market, events, loading, error } =
        useContext(DataContext);

    // Get logged-in user's ID from Appwrite session (provided in DataContext)
    // const loggedInUserId = user?.$id;
    const loggedInUserId = "687a850100101f0c50bf";

    console.log(loggedInUserId)

    if (loading) return <p>Loading...</p>;
    // if (!user) return <p>Please log in to view your posts.</p>;

    // Filter posts created by this user
    const filteredJobs = jobs?.filter(post => post.userId === loggedInUserId);
    const filteredRooms = rooms?.filter(post => post.user === loggedInUserId);
    const filteredMarket = market?.filter(post => post.userId === loggedInUserId);
    const filteredEvents = events?.filter(post => post.userId === loggedInUserId);

    const items = [
        { data: filteredJobs, title: "Jobs", link: "/jobs" },
        { data: filteredRooms, title: "Rooms", link: "/rooms" },
        { data: filteredMarket, title: "Market", link: "/market" },
        { data: filteredEvents, title: "Events", link: "/events" },
    ];

    return (
        <div className="space-y-6 mt-10">
            {/* <CategoryTiles /> */}

            {items.map((item, i) =>
                item.data && item.data.length > 0 ? (
                    <PostSection
                        key={i}
                        title={`My ${item.title}`}
                        data={item.data}
                        loading={loading}
                        error={error}
                        link={item.link}
                    />
                ) : null
            )}

            <Footer />
        </div>
    );
};

export default MyPosts;
