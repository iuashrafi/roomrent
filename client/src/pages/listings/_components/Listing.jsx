import { Link } from "react-router-dom";
import PlaceImg from "../../../components/PlaceImg";
import { toast } from "sonner";
import axios from "axios";
const Listing = ({ place }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`/api/places/${place._id}`)
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <Link
      to={"/places/" + place._id}
      className="flex cursor-pointer gap-4 bg-gray-50 shadow-sm border p-3 rounded-lg"
    >
      <div className="flex w-32 h-32 grow shrink-0">
        <PlaceImg place={place} className="object-cover rounded-md" />
      </div>
      <div className=" flex flex-col">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">{place.title}</h2>
          <button onClick={handleDelete} className="btn btn-link btn-sm">
            Delete
          </button>
        </div>
        <p className="text-sm mt-2">{place.description}</p>
      </div>
    </Link>
  );
};

export default Listing;
