// src/components/ListingDetails/GallerySection.jsx
import { useState } from 'react';

export default function GallerySection({ gallery = [] }) {
  const [showAll, setShowAll] = useState(false);

  if (gallery.length === 0) return null;

  return (
    <div className="relative mb-6">
      <div className="flex gap-3">
        {/* LEFT SIDE: Big Image */}
        <div
          className="overflow-hidden rounded-lg h-[300px] w-[60%] cursor-pointer"
          onClick={() => setShowAll(true)}
        >
          <img
            src={gallery[0]}
            alt="photo-0"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE: Small Grid of 4 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 w-[40%]">
          {gallery.slice(1, 5).map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg h-[140px] cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <img
                src={item}
                alt={`photo-${i + 1}`}
                className="w-full h-full object-cover"
              />

              {/* VIEW ALL PHOTOS button on last image */}
              {i === 3 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAll(true);
                  }}
                  className="absolute bottom-3 right-3 bg-/90 px-3 py-1 rounded shadow font-semibold text-xs hover:bg-gray-100 transition"
                >
                  VIEW ALL PHOTOS
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for all photos */}
      {showAll && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-5xl w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">All Photos</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setShowAll(false)}
              >
                ✕
              </button>
            </div>

            {/* Image grid inside modal */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto">
              {gallery.map((item, i) => (
                <img
                  key={i}
                  src={item}
                  alt={`photo-${i}`}
                  className="rounded-lg w-full h-48 object-cover"
                />
              ))}
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowAll(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}