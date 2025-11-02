// frontend/src/components/Map/GlobalMap.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// marker icon fix
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// =========================================================================
// 1. FULLSCREEN CONTROL COMPONENT (Must be defined before or inside GlobalMap)
// =========================================================================
const FullscreenControl = ({ onToggle }) => {
    // Access the Leaflet map instance
    const map = useMap();
    
    useEffect(() => {
        // Define a custom Leaflet Control
        const ExpandControl = L.Control.extend({
            options: {
                position: 'topright' // Position like the default zoom control
            },
            onAdd: function(map) {
                // Create the button container
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                container.style.backgroundColor = 'white';
                container.style.padding = '2px';
                container.style.cursor = 'pointer';
                container.style.fontWeight = 'bold';
                container.title = 'Toggle Fullscreen';
                
                // Simple icon/text for the button
                container.innerHTML = '<span style="padding: 0 4px; font-size: 16px;">&#x26F6;</span>'; // ⛶ (Fullscreen icon)

                // Attach click event
                container.onclick = (e) => {
                    L.DomEvent.stop(e); // Prevent map click behavior (e.g., zoom)
                    onToggle(); // Call the parent function to change state
                    
                    // Force map to redraw itself and center correctly after size change
                    setTimeout(() => {
                        map.invalidateSize();
                        // Optional: Re-center the map view
                        if (map.getCenter()) {
                            map.setView(map.getCenter(), map.getZoom()); 
                        }
                    }, 50); 
                };

                return container;
            },
            onRemove: function(map) { /* Nothing to do on removal */ }
        });

        const control = new ExpandControl();
        map.addControl(control);

        // Cleanup function
        return () => {
            map.removeControl(control);
        };
    }, [map, onToggle]);

    return null; // This component renders no HTML
};
// =========================================================================


//to show all listings on the map 
const BoundsUpdater = ({ markerData, mapRef }) => {
    const map = useMap();

    useEffect(() => {
        // Check if we have multiple listings and a map instance
        if (markerData.length > 1 && map) {
            
            // 1. Create a LatLngBounds object
            const bounds = new L.LatLngBounds();
            
            // 2. Extend the bounds for every marker
            markerData.forEach(m => {
                if (m.latitude && m.longitude) {
                    bounds.extend([m.latitude, m.longitude]);
                }
            });
            
            // 3. Fit the map view to the calculated bounds
            if (bounds.isValid()) {
                map.fitBounds(bounds, {
                    padding: [50, 50], // Add padding around the markers (in pixels)
                    maxZoom: 14        // Prevent zooming too close if markers are very near
                });
            }
        }
    }, [markerData, map]); // Rerun when markerData or map instance changes

    return null;
};




export default function GlobalMap({ listings = [], listing, mapHeight = "400px" }) {
  // 2. --- NEW STATE FOR EXPANDED VIEW ---
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  const [markerData, setMarkerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mountedRef = useRef(false);

  const markers = listing ? [listing] : listings;

  // fetch coords (Nominatim)
  useEffect(() => {
    let alive = true;
    const fetchCoordinates = async () => {
      try {
        const results = await Promise.all(
          markers.map(async (item) => {
            const locationName = item.city || item.address || item.streetAddress || "Delhi, India";
            // add email param to be polite to Nominatim; do NOT set User-Agent
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              locationName
            )}&limit=1&email=yourapp@example.com`;
            const res = await axios.get(url, { headers: { "Accept-Language": "en" } });
            const data = res.data && res.data.length ? res.data[0] : null;
            return {
              ...item,
              latitude: data ? parseFloat(data.lat) : item.latitude || 28.6139,
              longitude: data ? parseFloat(data.lon) : item.longitude || 77.2090,
              display_name: data?.display_name || locationName,
            };
          })
        );
        if (alive) setMarkerData(results);
      } catch (err) {
        console.error("Geocode error:", err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (markers.length > 0) {
      fetchCoordinates();
    } else {
      setLoading(false);
    }

    return () => {
      alive = false;
    };
  }, [markers]);

  // compute center only when we have coords
  const defaultCenter =
    markerData && markerData.length > 0 && markerData[0].latitude !== undefined
      ? { lat: markerData[0].latitude, lng: markerData[0].longitude }
      : null; // null until we have coordinates

  const initialZoom = listing ? 13 : 5;

  // whenCreated callback to capture map instance
  const onMapCreated = useCallback((mapInstance) => {
    mapRef.current = mapInstance;

    // ensure map gets correct size and center — do a few retries with delays
    const tryInvalidate = () => {
      if (!mapRef.current) return;
      try {
        mapRef.current.invalidateSize();
      } catch (e) {
        /* ignore */
      }
    };

    // run a few times to cover any layout transitions or sticky behavior
    setTimeout(tryInvalidate, 50);
    setTimeout(tryInvalidate, 250);
    setTimeout(tryInvalidate, 600);

    // if center exists, setView after ready
    mapInstance.whenReady(() => {
      tryInvalidate();
      if (defaultCenter) {
        try {
          mapInstance.setView([defaultCenter.lat, defaultCenter.lng], initialZoom);
        } catch (e) {}
      }
    });
  }, [defaultCenter, initialZoom]);

  // ensure map resizes on window resize and when tab visibility changes
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        try {
          mapRef.current.invalidateSize();
        } catch (e) {}
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && mapRef.current) {
        try {
          mapRef.current.invalidateSize();
        } catch (e) {}
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // if we have coords now and the map exists, update view and invalidate
  useEffect(() => {
    if (!defaultCenter) return;
    if (mapRef.current) {
      try {
        mapRef.current.setView([defaultCenter.lat, defaultCenter.lng], initialZoom);
        // a couple of invalidates to force tile render
        mapRef.current.invalidateSize();
        setTimeout(() => mapRef.current.invalidateSize(), 300);
      } catch (e) {}
    }
  }, [defaultCenter, initialZoom]);

  // ensure we ONLY render the MapContainer after we have a center (prevents 0x0 init)
  if (loading) return <div className="text-center py-4">Loading map...</div>;
  if (!defaultCenter)
    return (
      <div className="h-[400px] flex items-center justify-center text-sm text-gray-500" style={{height: mapHeight}}>
        Location not available
      </div>
    );

  // 3. --- DYNAMIC STYLING FOR FULLSCREEN OVERLAY ---
  const fullScreenStyle = isExpanded
    ? "fixed inset-0 z-[9999] bg-white p-2" // fixed fullscreen overlay
    : "relative w-full"; // normal container style

  // The map container should take up 100% of the parent div's space
  // When expanded, the parent div is fullscreen, so the map is fullscreen.
  const containerKey = `${defaultCenter.lat}-${defaultCenter.lng}-${mapHeight}-${isExpanded}`;

  return (
    <div className={fullScreenStyle} style={isExpanded ? { height: '100vh', width: '100vw' } : { height: mapHeight }}>
      <MapContainer
        key={containerKey}
        whenCreated={onMapCreated}
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={initialZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Bounds updater MUST be inside MapContainer to access the map instance */}
        <BoundsUpdater markerData={markerData} mapRef={mapRef} />
        {/* 4. INTEGRATE THE FULLSCREEN CONTROL */}
        <FullscreenControl onToggle={toggleExpand} />

        {markerData.map((m, i) => (
          <Marker key={i} position={[m.latitude, m.longitude]}>
            <Popup>{m.display_name || m.city || "Property Location"}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}