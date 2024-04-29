import { BACKEND_BASE_URL } from "../config";
const PlaceImg = ({ place, index = 0, className = null }) => {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }
  return (
    <img
      className={className}
      src={BACKEND_BASE_URL + "/uploads/" + place.photos[index]}
    />
  );
};

export default PlaceImg;
