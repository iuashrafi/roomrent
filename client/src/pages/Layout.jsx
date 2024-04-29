import { useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import { Toaster } from "sonner";
const Layout = ({ updatePlaces }) => {
  useEffect(() => {
    axios.get("/api/search/places").then((response) => {
      // for debugging
      // console.log("Response from get api/search/places =", response.data);
      updatePlaces([...response.data]);
    });
  }, []);

  return (
    <>
      <Navbar updatePlaces={updatePlaces} />
      <div className="container bg-emerald-30 mx-auto p-8">
        <Outlet />
      </div>
      <Toaster richColors closeButton />
    </>
  );
};

export default Layout;
