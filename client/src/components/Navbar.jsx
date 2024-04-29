import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import { BRANDNAME } from "../config";
import { FaHotel } from "react-icons/fa6";
import { toast } from "sonner";
import SearchModal from "./SearchModal";
import { Search, UserRound } from "lucide-react";
const Navbar = ({ updatePlaces }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const logout = async () => {
    toast.info("Logging out...");
    await axios.post("/api/auth/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 border-b px-2  ">
      <div className="flex-1 space-x-3">
        <Link to="/" className="btn btn-ghost  text-lg">
          <FaHotel />
          <span className="hidden sm:inline">{BRANDNAME}</span>
        </Link>
        <div className="">
          <label className="input input-bordered input-md rounded-full flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              onClick={() => document.getElementById("searchModal").showModal()}
            />
            <Search className="text-gray-500 w-5 h-5" />
          </label>
          {/* Search Modal */}
          <SearchModal updatePlaces={updatePlaces} />
        </div>
      </div>
      <div className="flex-none gap-2">
        {!user && (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary text-white">
              Create an account
            </Link>
          </>
        )}
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-md btn-circle avatar bg-secondary/20  flex justify-center items-center"
            >
              <UserRound />
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/bookings">Bookings</Link>
              </li>
              <li>
                <Link to="/places">Listings</Link>
              </li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
