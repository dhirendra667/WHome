// src/components/ListingDetails/AmenitiesSection.jsx
import { useState } from 'react';
import { facilities } from "../../data";

export default function AmenitiesSection({ amenities = [] }) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  return (
    <section className="mb-6">
      <h2 className="mt-4 mb-3 text-lg font-semibold text-blue-800">What this place offers</h2>
      <div className="flex flex-wrap gap-4">
        {(showAllAmenities ? amenities : amenities.slice(0, 8)).map((amen, i) => (
          <div key={i} className="flex flex-col font-semibold items-center justify-center w-[200px] h-[90px] rounded-lg border-2 border-gray-300 hover:border-2 hover:border-rose-500 hover:bg-gray-50 transition-all ">
            <div className="text-2xl mb-1 ">
              {facilities.find((f) => f.name === amen)?.icon || '🔹'}
            </div>
            <div className="text-sm">{amen}</div>
          </div>
        ))}
      </div>
      {amenities.length > 8 && (
        <button
          className="mt-3 text-blue-600 font-semibold"
          onClick={() => setShowAllAmenities((s) => !s)}
        >
          {showAllAmenities ? 'Show less' : `Show all ${amenities.length} amenities`}
        </button>
      )}
    </section>
  );
}