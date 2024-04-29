import { differenceInCalendarDays, format } from "date-fns";
import { CalendarDays, Moon } from "lucide-react";
export default function BookingDates({ booking, className }) {
  return (
    <div className={"flex gap-1 " + className}>
      <Moon />
      {differenceInCalendarDays(
        new Date(booking.checkOut),
        new Date(booking.checkIn)
      )}{" "}
      nights:
      <div className="flex gap-1 items-center ml-2">
        <CalendarDays />
        {format(new Date(booking.checkIn), "yyyy-MM-dd")}
      </div>
      &rarr;
      <div className="flex gap-1 items-center">
        <CalendarDays />
        {format(new Date(booking.checkOut), "yyyy-MM-dd")}
      </div>
    </div>
  );
}
