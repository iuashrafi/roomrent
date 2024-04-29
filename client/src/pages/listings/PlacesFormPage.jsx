import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PhotosUploader from "./_components/PhotosUploader";
import Perks from "./_components/Perks";
import { BACKEND_BASE_URL } from "../../config";
const PlacesFormPage = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get("/api/places/" + id).then((response) => {
      console.log(response.data);
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  const inputHeader = (text) => {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  };
  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>;
  };
  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const savePlace = async (ev) => {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      // update
      await axios.put(BACKEND_BASE_URL + "/api/places", {
        id,
        ...placeData,
      });
    } else {
      // new place
      await axios.post(BACKEND_BASE_URL + "/api/places", placeData);
    }
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={"/places"} />;
  }
  return (
    <div className="bg-green-30">
      <div className="py-4">
        <h1 className="text-2xl font-semibold ">Add New Place</h1>
      </div>

      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place. should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="title, for example: My lovely apt"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />

        {preInput("Address", "Address to this place")}
        <input
          type="text"
          className="input input-bordered w-full"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />
        {preInput("Photos", "more = better")}

        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "description of the place")}
        <textarea
          className="textarea textarea-bordered w-full"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Perks", "select all the perks of your place")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra info", "house rules, etc")}
        <textarea
          className="textarea textarea-bordered w-full"
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput(
          "Check in&out times",
          "add check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          <div className="space-y-1">
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
            />
          </div>
          <div className="space-y-1">
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11"
            />
          </div>
          <div className="space-y-1">
            <h3 className="mt-2 -mb-1">Max no. of guests</h3>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div className="space-y-1">
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary my-4">Save</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
