import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import Listing from "./_components/Listing";

// Page to display listings done by the user
const MyPlacesPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    axios.get("/api/places/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <div className="py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold ">My Listings</h1>
        <Link
          className="btn btn-secondary btn-sm inline-flex gap-1 rounded-full"
          to={"/places/new"}
        >
          + Add new place
        </Link>
      </div>

      <div className="mt-4 space-y-4">
        {places.length === 0 && "No listings to display"}
        {places.length > 0 &&
          places.map((place) => <Listing key={place._id} place={place} />)}
      </div>
    </div>
  );
};

export default MyPlacesPage;
