/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Search, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: any;
  }
}

const AddYourBusinessLocation = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    streetAddress: "",
    streetNumber: "",
    city: "",
    postalCode: "",
  });
  const router = useRouter();
  useEffect(() => {
    const loadScript = (url: string) => {
      if (document.querySelector(`script[src="${url}"]`)) return;
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyBHT9ARgpTJIEdvsiaD72Gf7SUUXz-Xqfg&libraries=places`
    );

    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initMap();
        clearInterval(interval);
      }
    }, 400);

    const initMap = () => {
      const defaultLocation = { lat: 40.4168, lng: -3.7038 }; 

      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 12,
      });

      markerRef.current = new window.google.maps.Marker({
        map,
        position: defaultLocation,
        animation: window.google.maps.Animation.DROP,
      });

      const input = document.getElementById("autocomplete") as HTMLInputElement;
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        fields: ["address_components", "geometry", "formatted_address"],
        types: ["address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.address_components) return;

        const location = place.geometry.location;
        map.setCenter(location);
        map.setZoom(15);
        markerRef.current.setPosition(location);

        const addressComponents: any = {};
        place.address_components.forEach((component: any) => {
          const type = component.types[0];
          switch (type) {
            case "route":
              addressComponents.streetAddress = component.long_name;
              break;
            case "street_number":
              addressComponents.streetNumber = component.long_name;
              break;
            case "locality":
              addressComponents.city = component.long_name;
              break;
            case "postal_code":
              addressComponents.postalCode = component.long_name;
              break;
          }
        });

        setFormData({
          streetAddress: addressComponents.streetAddress || "",
          streetNumber: addressComponents.streetNumber || "",
          city: addressComponents.city || "",
          postalCode: addressComponents.postalCode || "",
        });
      });
    };
  }, []);

  const handleSave = () => {
    router.push("/become-vendor/bank-details");
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 sm:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <MapPin className="text-[#DC3173] w-7 h-7" />
          <h1 className="text-2xl font-bold text-gray-800">
            Add Your Business Location
          </h1>
        </div>

        {/* Search box */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
          <input
            id="autocomplete"
            placeholder="Search your business address..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DC3173]"
          />
        </div>

        {/* Map */}
        <div
          ref={mapRef}
          className="w-full h-80 rounded-xl shadow-md border border-gray-300"
        />

        {/* Address fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) =>
                setFormData({ ...formData, streetAddress: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#DC3173] outline-none"
              placeholder="Street Address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Number
            </label>
            <input
              type="text"
              value={formData.streetNumber}
              onChange={(e) =>
                setFormData({ ...formData, streetNumber: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#DC3173] outline-none"
              placeholder="Street Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#DC3173] outline-none"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#DC3173] outline-none"
              placeholder="Postal Code"
            />
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#DC3173] text-white font-semibold rounded-xl shadow-md hover:bg-[#DC3173] transition"
        >
          <Save className="w-5 h-5" />
          Save Location & Next
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AddYourBusinessLocation;
