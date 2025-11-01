// src/components/ListingDetails/InfoSection.jsx 
import { useState } from 'react';

export default function InfoSection({ listing, host, dayCount, user }) { // Added 'user' prop for host image fallback
  const [showFullDesc, setShowFullDesc] = useState(false);

  return (
    <section>
      
      <hr className="my-6" />

      {/* FLEX CONTAINER FOR DESCRIPTION AND HOST SNIPPET */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-16">
        
        {/* LEFT SIDE: About this space (Takes up 2/3 space on large screens) */}
        <div className="lg:w-2/3">
          
          {/* About this space (expandable) */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-rose-500 mb-5">About this space</h2>
            <p className="text-gray-700 max-w-3xl">
              {showFullDesc ? listing.description : `${String(listing.description || '').slice(0, 300)}`}
              {listing.description && listing.description.length > 300 && (
                <button
                  onClick={() => setShowFullDesc((s) => !s)}
                  className="ml-2 text-blue-600 font-semibold"
                >
                  {showFullDesc ? 'Show less' : 'Show more'}
                </button>
              )}
            </p>


            {/* Map Snippet placeholder */}
            {/* <div className="mt-4 w-full max-w-3xl h-44 rounded-lg overflow-hidden border">
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                Map snippet (add real map later)
              </div>
            </div> */}


          </div>
        </div>

        {/* RIGHT SIDE: Host info snippet (Takes up 1/3 space on large screens) */}
        <div className="lg:w-1/6 lg:mt-0 mt-2 p-0  rounded-xl h-fit"> {/* h-fit makes the border only wrap the content */}
          <div className="mb-4">
            {/* <h2 className="text-lg font-semibold mb-2">Hosted by</h2> */}
            <div className="flex items-center gap-4">
              <img
                src={host.profileImagePath || host.avatar?.secure_url || user?.avatar?.secure_url}
                alt="host"
                className="w-20 h-20 rounded-full object-cover ml-[5px]"
              />
              
            </div>
            <div>
                <div className="font-semibold">{host.firstName} {host.lastName} host</div>
                <div className="text-sm text-gray-600">
                  Superhost • {host.yearsHosting || '1'} yrs hosting
                </div>
              </div>
          </div>
        </div>
        
      </div>
      {/* Callout box */}
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-300 rounded">
              <div className="font-sm">
                Guest favourite • ⭐ 4.8 • {listing.reviewCount || 0} reviews
              </div>
            </div>
      {/* END OF FLEX CONTAINER  */}

      <hr className="my-6" />
      <h2 className="text-xl font-semibold text-rose-500 mb-5">{listing.highlight}</h2>
      <p className="text-gray-700 max-w-3xl">
        {showFullDesc ? listing.highlightDesc : `${String(listing.highlightDesc || '').slice(0, 300)}`}
        {listing.highlightDesc && listing.highlightDesc.length > 300 && (
          <button
            onClick={() => setShowFullDesc((s) => !s)}
            className="ml-2 text-blue-600 font-semibold"
          >
            {showFullDesc ? 'Show less' : 'Show more'}
          </button>
        )}
      </p>
    </section>
  );
}