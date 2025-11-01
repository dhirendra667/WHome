// hooks/useListingDetails.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function useListingDetails() {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    async function getListingDetails() {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/listing/${listingId}`
        );
        setListing(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch Listing Details Failed:", err.message);
        setLoading(false);
      }
    }
    getListingDetails();
  }, [listingId]);

  return { loading, listing, listingId };
}