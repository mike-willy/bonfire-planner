// src/components/MapPanel.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// ✅ Helper component to auto-fit map to selected markers
function FitBounds({ destinations }) {
  const map = useMap();

  useEffect(() => {
    if (destinations.length === 0) return;

    const bounds = L.latLngBounds(
      destinations.map((d) => [d.coords.lat, d.coords.lng])
    );
    map.fitBounds(bounds, { padding: [50, 50] }); // add padding for nice spacing
  }, [destinations, map]);

  return null;
}

export default function MapPanel() {
  const { selectedDestinations } = useContext(AppContext);

  return (
    <MapContainer
      center={[-1.2921, 36.8219]} // Default Nairobi
      zoom={6}
      style={{ width: "100%", height: "240px", borderRadius: "0.75rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {selectedDestinations.map(
        (d) =>
          d.coords && (
            <Marker
              key={d.id}
              position={[d.coords.lat, d.coords.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{d.title}</strong> <br />
                {d.tag}
              </Popup>
            </Marker>
          )
      )}

      {/* ✅ Auto-fit when destinations change */}
      <FitBounds destinations={selectedDestinations.filter((d) => d.coords)} />
    </MapContainer>
  );
}
