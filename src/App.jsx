import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LogIn from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/Home/HomePage"; // Correct import for your Home page
import PostListing from "./pages/PostListing/PostListing";
import {
  JobPostForm,
  MarketPostForm,
  RoomPostForm,
  EventPostForm,
} from "./components/Post";
import {
  JobDetailPage,
  MarketDetailPage,
  EventDetailPage,
  ListingDetailPage,
} from "./components/Listings";
import { DataProvider } from "./context/DataContext";
import RoomList from "./components/Listings/RoomList/RoomList";
import RoomDetailPage from "./components/Listings/Rooms/RoomDetailPage";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import EventList from "./components/Listings/Events/EventListPage";
import JobList from "./components/Listings/Jobs/JobListPage";

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

              <Route path="post-listing" element={<PostListing />} />

              {/* JOBS */}

              <Route path="add-job" element={<JobPostForm />} />
              <Route path="jobs/:id" element={<JobDetailPage />} />
              <Route path="job-list" element={<JobList />} />

              {/* EVENTS */}
              <Route path="add-event" element={<EventPostForm />} />
              <Route path="event-list" element={<EventList />} />
              <Route path="events/:id" element={<EventDetailPage />} />

              {/* ROOMS */}
              <Route path="add-room" element={<RoomPostForm />} />
              <Route path="rooms/:id" element={<RoomDetailPage />} />
              <Route path="rooms/room-list" element={<RoomList />} />

              {/* MARKET */}
              <Route path="add-market" element={<MarketPostForm />} />
              <Route path="market/:id" element={<MarketDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </>
  );
}

export default App;
