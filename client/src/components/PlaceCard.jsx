import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from "../config";

const PlaceCard = ({ place }) => {
  return (
    <Link to={"/place/" + place._id}>
      <div className="card card-compact bg-base-100 border">
        <figure>
          <img src={BACKEND_BASE_URL + "/uploads/" + place.photos[0]} alt="" />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-lg sm:text-lg">{place.title}</h2>
          <p className="text-base md:text-sm 2xl:text-lg">{place.address}</p>
          <div className="mt-1">
            <span className="font-bold text-base sm:text-lg 2xl:text-xl">
              ${place.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
