// components/ListingDetails/BookingWidget.jsx
import { DateRange } from "react-date-range";


// Import the new map component
import GlobalMap from "../Map/GlobalMap";

export default function BookingWidget({
  listing,
  dateRange,
  handleDateSelect,
  dayCount,
  guests,
  setGuests,
  totalPrice,
  handleSubmit,
}) {
  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24">
        <div className="bg-white border rounded-xl shadow p-5 mb-4">
          {/* Price and Rate */}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-semibold">₹ {listing?.price}</div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="mt-4">
            <label className="text-sm font-semibold">CHECK-IN</label>
            <div className="mt-2">
              <DateRange ranges={dateRange} onChange={handleDateSelect} />
            </div>
          </div>

          {/* Guests Selector */}
          <div className="mt-3">
            <label className="text-sm font-semibold">GUESTS</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full mt-2 border rounded px-3 py-2"
            >
              {Array.from({ length: listing?.guestCount || 10 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>

          {/* Total Price */}
          <div className="mt-4 text-gray-700">
            <div>
              {listing?.bedroomCount} bedroom(s) • {listing?.bedCount} bed(s)
            </div>
            <div className="font-semibold mt-2">
              Total: ₹ {totalPrice} for {dayCount} {dayCount > 1 ? 'nights' : 'night'}
            </div>
          </div>

          {/* Reserve Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Reserve
          </button>
          <div className="mt-3 text-xs text-gray-500">You won't be charged yet</div>
        </div>

        {/* Location Map Section */}
        <div className="bg-white border rounded-xl shadow p-4">
          <div className="text-sm font-semibold mb-2">
            Location: {listing.streetAddress}, {listing.city}, {listing.province}, {listing.country}
          </div>

          {/* Map Container (always has real pixel height) */}
          <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <GlobalMap listing={listing} mapHeight="384px" />
          </div>
        </div>

      </div>
    </aside>
  );
}