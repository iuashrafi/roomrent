import { useState, useContext, useEffect } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import { toast } from "sonner";
const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setnumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);
  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const bookThisPlace = async () => {
    axios
      .post("/api/bookings", {
        place: place._id,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price: numberOfNights * place.price,
      })
      .then((response) => {
        toast.success("Booking confirmed!");
        const bookingId = response.data._id;
        navigate(`/bookings/${bookingId}`);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  /*
  // stripe payment checkout
  const checkout = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/create-checkout-session",
        {
          method: "POST",
        }
      );
      const session = await response.json();
      window.location.href = session.url; // Redirect to Stripe checkout page
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };
  */
  if (!user) {
    return (
      <div className="bg-white shadow-md p-4 rounded-2xl">Log in to book</div>
    );
  }
  return (
    <div className="bg-white shadow-md p-4 rounded-2xl">
      <div className="text-xl text-center">Price: ${place.price}/per night</div>
      <div className="border mt-4 rounded-2xl">
        <div className="flex">
          <div className="py-3 px-4">
            <label htmlFor="">Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label htmlFor="">Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t space-x-2">
          <label htmlFor="">Number of guests</label>
          <input
            type="number"
            className="input input-bordered input-sm"
            value={numberOfGuests}
            onChange={(ev) => setnumberOfGuests(ev.target.value)}
          />
        </div>

        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t space-x-2 space-y-1">
            <div className="space-x-2">
              <label>Your full name:</label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
            <div className="space-x-2">
              <label>Phone number:</label>
              <input
                type="tel"
                value={phone}
                className="input input-bordered input-sm"
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      <button
        onClick={bookThisPlace}
        className="btn btn-secondary rounded-2xl mt-4 "
      >
        Book this place{" "}
        {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
      </button>
      {/* <button type="submit" onClick={checkout}>
        Checkout
      </button> */}
    </div>
  );
};

export default BookingWidget;
