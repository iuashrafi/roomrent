import PlaceImg from "../../../components/PlaceImg";
import BookingDates from "../../../components/BookingDates";
import { CreditCard } from "lucide-react";
const BookingList = ({ booking }) => {
  return (
    <>
      <div className="flex w-40 h-40">
        <PlaceImg place={booking.place} className="rounded-md object-cover" />
      </div>

      <div className="grow space-y-3">
        <h2 className="text-xl font-semibold">{booking.place.title}</h2>
        <div className="text-lg space-y-2">
          <BookingDates booking={booking} className="text-lg text-gray-800" />
          <div className="flex gap-1">
            <CreditCard />
            <span className="text-lg">Total price: ${booking.price}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingList;
