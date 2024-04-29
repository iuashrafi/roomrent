import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BookingList from "./_components/BookingList";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`/api/bookings`).then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold py-6">My Bookings</h1>
      <div className="space-y-3">
        {bookings.length === 0 && "No bookings history"}
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              key={booking._id}
              to={`/bookings/${booking._id}`}
              className="flex cursor-pointer gap-4 bg-gray-50 shadow-sm border p-3 rounded-lg"
            >
              <BookingList booking={booking} />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
