import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
// importing user context
import { UserContextProvider } from "./UserContext";

// importing layouts and pages
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";

import AuthLayout from "./pages/auth/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import MyBookingsPage from "./pages/bookings/MyBookingsPage";
import BookingPage from "./pages/bookings/BookingPage";

import MyPlacesPage from "./pages/listings/MyPlacesPage";
import PlacesFormPage from "./pages/listings/PlacesFormPage";
import PlacePage from "./pages/listings/PlacePage";

import MyProfilePage from "./pages/profile/MyProfilePage";
import { useEffect, useState } from "react";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

const App = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {}, []);
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout updatePlaces={setPlaces} />}>
            <Route index element={<HomePage places={places} />} />

            {/* Auth pages */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Bookings pages */}
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/bookings/:id" element={<BookingPage />} />

            {/* Profile pages */}
            <Route path="/profile" element={<MyProfilePage />} />

            {/* Places pages */}
            <Route path="/places" element={<MyPlacesPage />} />
            <Route path="/places/new" element={<PlacesFormPage />} />
            <Route path="/places/:id" element={<PlacesFormPage />} />
            <Route path="/place/:id" element={<PlacePage />} />
            {/* end  */}
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
};

export default App;
