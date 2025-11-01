// pages/ListingDetails.jsx
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useListingDetails } from "../hooks/useListingDetails"; 
import { useBooking } from "../hooks/useBooking"; 
import { Bed } from "@mui/icons-material";

// Import UI components
import GallerySection from "../components/ListingDetails/GallerySection";
import BookingWidget from "../components/ListingDetails/BookingWidget";
import InfoSection from "../components/ListingDetails/InfoSection";
import AmenitiesSection from "../components/ListingDetails/AmenitiesSection";
import PoliciesSection from "../components/ListingDetails/PoliciesSection";
import HostDetailsSection from "../components/ListingDetails/HostDetailsSection";
import ReviewsSection from "../components/ListingDetails/ReviewsSection";


function ListingDetails() {
  const user = useSelector((state) => state.user); // still needed for host avatar fallback

  // --- Core Logic from Hooks ---
  const { loading, listing, listingId } = useListingDetails();
  const {
    dateRange,
    handleDateSelect,
    dayCount,
    guests,
    setGuests,
    totalPrice,
    handleSubmit,
  } = useBooking(listing, listingId);
  // -----------------------------

  if (loading) return <Loader />;
  if (!listing) return <div>Listing not found.</div>;

  const host = listing?.creator || {};

  return (
    <>
      <Navbar />
      <div className="px-4 md:px-12 lg:px-24 py-8">
        {/* Full-width Gallery Section */}
        <GallerySection gallery={listing.listingPhotoPaths || []} />

        {/* Title + Two column layout: left main (span 2), right sticky booking (span 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - main content (spans 2 on large screens) */}
          <div className="lg:col-span-2">

            {/* About this space & Host Snippet */}
            <InfoSection listing={listing} host={host} user={user} />

            <hr className="my-6" />

            {/* Where you'll sleep placeholder (can be included in InfoSection) */}
            <section className="mb-6">
               <h2 className="mt-4 mb-3 text-lg font-semibold text-blue-800">Where you'll sleep</h2>
               {/* <div className="text-gray-700">{listing?.sleepingArrangements || '1 double bed'}</div> */}
               <div className="flex flex-col font-semibold items-center justify-center w-[200px] h-[90px] rounded-lg border-2 border-gray-300 hover:border-2 hover:border-rose-500 hover:bg-gray-50 transition-all "><Bed className="text-2xl mb-1" />{listing?.sleepingArrangements || '1 double bed'}</div>
            </section>

            <hr className="my-6" />
            {/* Amenities Grid */}
            <AmenitiesSection amenities={listing.amenities || []} />

            {/* Accessibility placeholder (can be included in InfoSection) */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Accessibility</h2>
              <p className="text-gray-700 max-w-3xl">{listing.accessibility || 'No special accessibility info provided.'} <button className="ml-2 text-blue-600" onClick={() => {}}>Show more</button></p>
            </section>

            <hr className="my-6" />
            
            {/* Detailed Host Info */}
            <HostDetailsSection host={host} user={user} />

            <hr className="my-6" />

            {/* Policies */}
            <PoliciesSection listing={listing} />

            {/* <hr className="my-6" /> */}

            {/* Reviews placeholder */}
            {/* <ReviewsSection listing={listing} /> */}
            {/* <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">Reviews • ⭐ {listing?.avgRating || '4.8'}</h2>
              <div className="text-gray-700">Overall rating breakdown and individual reviews will go here.</div>
            </section> */}

          </div>

          {/* RIGHT COLUMN - Sticky booking widget */}
          <BookingWidget
            listing={listing}
            dateRange={dateRange}
            handleDateSelect={handleDateSelect}
            dayCount={dayCount}
            guests={guests}
            setGuests={setGuests}
            totalPrice={totalPrice}
            handleSubmit={handleSubmit}
          />

        </div>
      </div>
        <div>
          <hr className="my-6 ml-[80px] mr-[80px]" />

          {/* REVIEWS SECTION */}
          <ReviewsSection listing={listing} /> 
        </div>

      <Footer />
    </>
  );
}

export default ListingDetails;

