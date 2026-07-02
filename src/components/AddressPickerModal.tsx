import { AnimatePresence, motion } from "framer-motion";
import { Check, LocateFixed, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type Coords = { lat: number; lng: number };
type LeafletModule = typeof import("leaflet");

type AddressPickerModalProps = {
  open: boolean;
  value: string;
  coords?: Coords | null;
  fallbackCoords?: Coords;
  deliveryRadiusKm?: number;
  onClose: () => void;
  onSelect: (address: string, coords?: Coords) => void;
};

const DEFAULT_CENTER: Coords = { lat: 52.1306623, lng: -106.7272992 };
const CANADA_BOUNDS: [[number, number], [number, number]] = [
  [41.67, -141.1],
  [83.2, -52.6],
];

export function AddressPickerModal({
  open,
  value,
  coords,
  fallbackCoords = DEFAULT_CENTER,
  deliveryRadiusKm,
  onClose,
  onSelect,
}: AddressPickerModalProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const radiusCircleRef = useRef<import("leaflet").Circle | null>(null);
  const storeMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(value);
  const [selectedCoords, setSelectedCoords] = useState<Coords | undefined>();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedAddress(value);
    setSelectedCoords(coords ?? undefined);
    setManualAddress("");
    setManualMode(false);
    setMessage("");
  }, [open, value, coords]);

  useEffect(() => {
    if (!open || !mapNodeRef.current || mapRef.current) return;

    let cancelled = false;

    import("leaflet").then((leaflet) => {
      if (cancelled || !mapNodeRef.current) return;

      leafletRef.current = leaflet;
      const initialCoords = coords ?? fallbackCoords;
      const initialZoom = coords ? 16 : 12;
      const map = leaflet.map(mapNodeRef.current, {
        zoomControl: false,
        maxBounds: CANADA_BOUNDS,
        maxBoundsViscosity: 1,
        minZoom: 4,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelDebounceTime: 30,
        wheelPxPerZoomLevel: 80,
        inertia: true,
        easeLinearity: 0.25,
      }).setView([initialCoords.lat, initialCoords.lng], initialZoom);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          bounds: CANADA_BOUNDS,
          maxZoom: 19,
          noWrap: true,
        })
        .addTo(map);

      leaflet.control.zoom({ position: "bottomright" }).addTo(map);

      if (deliveryRadiusKm) {
        radiusCircleRef.current = leaflet
          .circle([fallbackCoords.lat, fallbackCoords.lng], {
            radius: deliveryRadiusKm * 1000,
            color: "#e70f2f",
            weight: 3,
            fillColor: "#e70f2f",
            fillOpacity: 0.08,
          })
          .addTo(map);
      }

      storeMarkerRef.current = leaflet
        .marker([fallbackCoords.lat, fallbackCoords.lng], {
          icon: leaflet.divIcon({
            className: "",
            iconAnchor: [16, 16],
            iconSize: [32, 32],
            html: `
              <div style="
                width:32px;height:32px;border-radius:999px;
                background:#0f0a0a;
                border:4px solid #fff;
                box-shadow:0 8px 18px rgba(0,0,0,.22);
                display:flex;align-items:center;justify-content:center;
                color:#fff;font-size:12px;font-weight:900;
              ">H</div>
            `,
          }),
          title: "Hakka Express",
        })
        .addTo(map);

      map.on("click", (event) => {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        if (!isWithinCanadaBounds({ lat, lng })) {
          setMessage("Please choose a location inside Canada.");
          return;
        }

        placeMarker(lat, lng, "Selected location");
        void reverseGeocode(lat, lng);
      });

      mapRef.current = map;
      if (coords) {
        placeMarker(coords.lat, coords.lng, value || "Selected location", 16, false);
      }

      window.setTimeout(() => {
        map.invalidateSize({ pan: false, debounceMoveend: true });
        if (coords) {
          moveMapTo(coords, 16, false);
        } else {
          fitDeliveryZone(false);
        }
      }, 120);
    });

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      markerRef.current = null;
      radiusCircleRef.current?.remove();
      radiusCircleRef.current = null;
      storeMarkerRef.current?.remove();
      storeMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
    };
  }, [open, coords, fallbackCoords, deliveryRadiusKm, value]);

  const moveMapTo = (target: Coords, zoom: number, animate = true) => {
    const map = mapRef.current;
    if (!map) return;

    map.invalidateSize({ pan: false, debounceMoveend: true });
    if (animate) {
      map.flyTo([target.lat, target.lng], zoom, { duration: 0.75, easeLinearity: 0.25 });
      return;
    }

    map.setView([target.lat, target.lng], zoom, { animate: false });
  };

  const fitDeliveryZone = (animate = true) => {
    const map = mapRef.current;
    const radiusCircle = radiusCircleRef.current;
    if (!map || !radiusCircle) {
      moveMapTo(fallbackCoords, 12, animate);
      return;
    }

    map.invalidateSize({ pan: false, debounceMoveend: true });
    map.fitBounds(radiusCircle.getBounds(), {
      padding: [28, 28],
      animate,
      duration: 0.75,
    });
  };

  const placeMarker = (lat: number, lng: number, label: string, zoom = 15, animate = true) => {
    const leaflet = leafletRef.current;
    const map = mapRef.current;
    if (!leaflet || !map) return;

    const icon = leaflet.divIcon({
      className: "",
      iconAnchor: [16, 34],
      iconSize: [32, 34],
      html: `
        <div style="
          width:32px;height:32px;border-radius:999px 999px 999px 0;
          transform:rotate(-45deg);
          background:#e70f2f;
          box-shadow:0 10px 24px rgba(0,0,0,.24);
          border:3px solid #fff;
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="transform:rotate(45deg);color:white;font-size:14px;font-weight:900;">✓</span>
        </div>
      `,
    });

    markerRef.current?.remove();
    markerRef.current = leaflet.marker([lat, lng], { icon, title: label }).addTo(map);
    moveMapTo({ lat, lng }, zoom, animate);
    setSelectedCoords({ lat, lng });
    setSelectedAddress(label);
  };

  const recenterMap = () => {
    if (selectedCoords || coords) {
      const target = selectedCoords ?? coords;
      if (target) moveMapTo(target, 16);
      return;
    }

    fitDeliveryZone();
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setBusy(true);
    setMessage("Reading the selected address...");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      const label = formatNominatimAddress(data, { lat, lng });
      setSelectedAddress(label);
      setMessage("");
    } catch {
      setSelectedAddress(`Selected location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      setMessage("Could not read the exact address, so coordinates are selected.");
    } finally {
      setBusy(false);
    }
  };

  const searchAddress = async () => {
    const query = manualAddress.trim();
    if (!query) {
      setMessage("Type an address, area, or city first.");
      return;
    }

    setBusy(true);
    setMessage("Searching...");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=ca&limit=1&q=${encodeURIComponent(query)}`,
      );
      const results = await response.json();

      if (!results.length) {
        setMessage("No location found. Try adding a city or country.");
        return;
      }

      const result = results[0];
      const lat = Number(result.lat);
      const lng = Number(result.lon);
      if (!isWithinCanadaBounds({ lat, lng })) {
        setMessage("Please search for an address inside Canada.");
        return;
      }

      const label = formatNominatimAddress(result, { lat, lng });
      placeMarker(lat, lng, label, 16);
      setMessage("");
    } catch {
      setMessage("Search failed. Try again or use current location.");
    } finally {
      setBusy(false);
    }
  };

  const requestCurrentLocation = () => {
    setMessage("");
    setManualMode(false);

    if (!navigator.geolocation) {
      setMessage("Location is unavailable in this browser. Use manual search instead.");
      return;
    }

    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const currentCoords = { lat: coords.latitude, lng: coords.longitude };
        if (!isWithinCanadaBounds(currentCoords)) {
          setBusy(false);
          setMessage("Your current location is outside Canada. Search a Canadian address instead.");
          return;
        }

        placeMarker(coords.latitude, coords.longitude, "Your current location", 16);
        void reverseGeocode(coords.latitude, coords.longitude);
      },
      () => {
        setBusy(false);
        setMessage("Location permission is blocked. Use manual search instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const confirmSelection = () => {
    if (!selectedCoords) {
      setMessage("Search or click the map to drop a pin first.");
      return;
    }

    onSelect(selectedAddress, selectedCoords);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/55 px-4 py-6 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl bg-background border border-border shadow-2xl"
          >
            <div className="h-16 px-5 border-b border-border flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-bold">Choose delivery address</div>
                <div className="text-xs text-muted-foreground truncate max-w-[240px] sm:max-w-md">{selectedAddress}</div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close address picker"
                className="h-9 w-9 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {manualMode && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void searchAddress();
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={manualAddress}
                      onChange={(event) => setManualAddress(event.target.value)}
                      placeholder="Search street, area, city, country"
                      className="w-full bg-card border border-border rounded-full pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    disabled={busy}
                    className="rounded-full bg-primary text-primary-foreground font-bold px-5 text-sm disabled:opacity-60"
                  >
                    Search
                  </button>
                </form>
              )}

              <div className="relative h-[min(54vh,430px)] min-h-[310px] overflow-hidden rounded-xl border border-border bg-secondary">
                <div ref={mapNodeRef} className="h-full w-full" />
                <div className="absolute left-3 top-3 z-[500] rounded-lg border border-primary/20 bg-white px-3 py-2 text-xs font-bold text-primary shadow-md">
                  18 km delivery radius from Hakka Express
                </div>
                <button
                  type="button"
                  onClick={recenterMap}
                  onMouseDown={(event) => event.stopPropagation()}
                  aria-label="Recenter map"
                  title="Recenter map"
                  className="absolute right-3 top-3 z-[500] h-10 w-10 rounded-full bg-white text-foreground border border-border shadow-md hover:text-primary hover:border-primary flex items-center justify-center transition-colors"
                >
                  <LocateFixed className="h-4 w-4" />
                </button>
                {!selectedCoords && (
                  <div className="absolute left-3 bottom-3 rounded-full bg-white px-3 py-1.5 text-xs text-muted-foreground shadow">
                    Search or click the map to drop a pin.
                  </div>
                )}
              </div>

              {message && (
                <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                  {message}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={requestCurrentLocation}
                  disabled={busy}
                  className="h-12 rounded-full bg-white text-foreground border border-border hover:border-primary hover:text-primary font-bold transition-colors disabled:opacity-60"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <LocateFixed className="h-4 w-4" /> Use your current location
                  </span>
                </button>
                <button
                  onClick={() => {
                    setManualMode(true);
                    setMessage("");
                  }}
                  className="h-12 rounded-full bg-white text-foreground border border-border hover:border-primary hover:text-primary font-bold transition-colors"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" /> Enter address manually
                  </span>
                </button>
              </div>

              <button
                onClick={confirmSelection}
                disabled={busy}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> OK, use this location
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function isWithinCanadaBounds(coords: Coords) {
  const [[south, west], [north, east]] = CANADA_BOUNDS;
  return coords.lat >= south && coords.lat <= north && coords.lng >= west && coords.lng <= east;
}

function formatNominatimAddress(data: any, coords: Coords) {
  const address = data.address ?? {};
  const street = [address.house_number, address.road].filter(Boolean).join(" ");
  const parts = [
    street,
    address.neighbourhood || address.suburb || address.quarter,
    address.city || address.town || address.village || address.county,
    address.state_district || address.state,
    address.postcode,
    address.country,
  ].filter(Boolean);

  if (parts.length > 1) return parts.join(", ");

  const label = data.display_name || parts[0];
  if (label && label !== address.country) return label;

  return `${label || "Selected location"} (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`;
}
