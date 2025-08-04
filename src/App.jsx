import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LogIn from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/Home/HomePage"; // Correct import for your Home page
import PostListing from "./pages/PostListing/PostListing";
import RoomDetailPage from "./components/Display/Rooms/RoomDetailPage";
import MyProfile from "./pages/Profile/MyProfile";
import { DataProvider } from "./context/DataContext";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import {
  JobPostForm,
  MarketPostForm,
  RoomPostForm,
  EventPostForm,
} from "./components/Post";
import {
  JobDetailPage,
  MarketDetailPage,
  CategoryTiles,
  EventDetailPage,
} from "./components/Display";
import MyPosts from "./components/Display/MyPosts/MyPosts";

function App() {
  return (
    <>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="login" element={<LogIn />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="my-posts" element={<MyPosts />} />

              <Route path="post-listing" element={<PostListing />} />

              {/* JOBS */}

              <Route path="add-job" element={<JobPostForm />} />
              <Route path="jobs/:id" element={<JobDetailPage />} />

              {/* EVENTS */}
              <Route path="add-event" element={<EventPostForm />} />
              <Route path="events/:id" element={<EventDetailPage />} />

              {/* ROOMS */}
              <Route path="add-room" element={<RoomPostForm />} />
              <Route path="rooms/:id" element={<RoomDetailPage />} />

              {/* MARKET */}
              <Route path="add-market" element={<MarketPostForm />} />
              <Route path="market/:id" element={<MarketDetailPage />} />

              {/* Tiles */}
              <Route path=":type" element={<CategoryTiles />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </>
  );
}

export default App;
