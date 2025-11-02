// src/components/ListingDetails/ReviewsSection.jsx

export default function ReviewsSection({ listing = {} }) {
  // Fallbacks for data
  const avgRating = listing.avgRating || '4.8';
  const reviewCount = listing.reviewCount || 0;

  return (
    <section className="mb-10 ml-[80px] mr-[80px]">
      <h2 className="text-2xl font-semibold mb-3">
        Reviews • ⭐ {avgRating} ({reviewCount} reviews)
      </h2>

      {/* Placeholder for rating breakdown bars and filters */}
      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50 mb-6">
        <h3 className="text-xl font-medium">Rating Breakdown (Placeholder)</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <div className="flex justify-between"><span>Cleanliness</span><span>4.9</span></div>
            <progress className="progress progress-primary w-full" value="98" max="100"></progress>
          </div>
          <div>
            <div className="flex justify-between"><span>Accuracy</span><span>4.7</span></div>
            <progress className="progress progress-primary w-full" value="94" max="100"></progress>
          </div>
          <div>
            <div className="flex justify-between"><span>Communication</span><span>5.0</span></div>
            <progress className="progress progress-primary w-full" value="100" max="100"></progress>
          </div>
          <div>
            <div className="flex justify-between"><span>Location</span><span>4.8</span></div>
            <progress className="progress progress-primary w-full" value="96" max="100"></progress>
          </div>
        </div>
      </div>

      {/* Placeholder for individual reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
            <div className="font-semibold">Guest A</div>
            <div className="text-sm text-gray-500 mb-2">⭐⭐⭐⭐⭐ • September 2024</div>
            <p className="text-gray-700">"Amazing stay! The host was very responsive and the location was perfect. Highly recommend to anyone visiting the area."</p>
        </div>
        <div className="p-4 border rounded-lg">
            <div className="font-semibold">Guest B</div>
            <div className="text-sm text-gray-500 mb-2">⭐⭐⭐⭐ • August 2024</div>
            <p className="text-gray-700">"A really nice place. It could use a bit more counter space in the bathroom, but overall a great experience."</p>
        </div>
      </div>

      <button className="mt-6 px-4 py-2 bg-white border rounded font-semibold hover:bg-gray-50 transition">
        Show all {reviewCount} reviews
      </button>
    </section>
  );
}