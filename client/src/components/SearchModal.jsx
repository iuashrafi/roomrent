import axios from "axios";
import { Search } from "lucide-react";
import { useState } from "react";
const SearchModal = ({ updatePlaces }) => {
  const [searchText, setSearchText] = useState("");
  const searchPlaces = async (queryParams) => {
    try {
      const response = await axios.get("/api/search/places", {
        params: queryParams,
      });
      console.log("Search Response:", response.data);
      updatePlaces(response.data);
    } catch (error) {
      console.error("Error searching places:", error);
    }
  };
  const handleSearchInputChange = (text) => {
    setSearchText(text);
    searchPlaces({ searchText });
  };
  return (
    <dialog id="searchModal" className="modal">
      <div className="modal-box">
        <label className="my-4 input input-bordered input-md rounded-full flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            onChange={(e) => handleSearchInputChange(e.target.value)}
          />
          <Search className="text-gray-500 w-5 h-5" />
        </label>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SearchModal;
