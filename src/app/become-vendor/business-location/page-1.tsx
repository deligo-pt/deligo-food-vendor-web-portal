/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { TResponse } from "@/src/types";
import { getCookie } from "@/src/utils/cookies";
import { fetchData, updateData } from "@/src/utils/requests";
import { businessLocationValidation } from "@/src/validations/become-vendor/business-location.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { ArrowLeftCircle, Save, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

declare global {
  interface Window {
    google: any;
  }
}

type LocationFormType = {
  streetAddress: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: string;
};

const AddYourBusinessLocation = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const router = useRouter();
  const [locationCoordinates, setLocationCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const form = useForm<LocationFormType>({
    resolver: zodResolver(businessLocationValidation),
    defaultValues: {
      streetAddress: "",
      streetNumber: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

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

    const interval = setInterval(async () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(interval);

        const defaultLocation = { lat: 40.4168, lng: -3.7038 }; // Madrid

        // --- Initialize Map
        const map = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 12,
        });

        markerRef.current = new window.google.maps.Marker({
          map,
          position: defaultLocation,
          animation: window.google.maps.Animation.DROP,
        });

        const geocoder = new window.google.maps.Geocoder();

        // --- Autocomplete
        const input = document.getElementById(
          "autocomplete"
        ) as HTMLInputElement;
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

          fillAddressFields(place.address_components);
        });

        // --- Map click listener
        map.addListener("click", (e: any) => {
          const clickedLocation = e.latLng;
          markerRef.current.setPosition(clickedLocation);
          map.setCenter(clickedLocation);

          geocoder.geocode(
            { location: clickedLocation },
            (results: any, status: any) => {
              if (status === "OK" && results[0]) {
                setLocationCoordinates({
                  latitude: clickedLocation.lat(),
                  longitude: clickedLocation.lng(),
                });
                const addressComponents = results[0].address_components;
                fillAddressFields(addressComponents);
              }
            }
          );
        });

        // --- Helper for form updates
        const fillAddressFields = (components: any) => {
          const address: any = {};
          components.forEach((c: any) => {
            const type = c.types[0];
            switch (type) {
              case "route":
                address.streetAddress = c.long_name;
                break;
              case "street_number":
                address.streetNumber = c.long_name;
                break;
              case "locality":
                address.city = c.long_name;
                break;
              case "postal_code":
                address.postalCode = c.long_name;
                break;
              case "country":
                address.country = c.long_name;
                break;
            }
          });

          form.setValue("streetAddress", address.streetAddress || "");
          form.setValue("streetNumber", address.streetNumber || "");
          form.setValue("city", address.city || "");
          form.setValue("postalCode", address.postalCode || "");
        };

        // --- Fetch saved data and move marker
        const accessToken = getCookie("accessToken");
        if (accessToken) {
          const decoded = jwtDecode(accessToken || "") as { id: string };
          try {
            const result = (await fetchData(`/vendors/${decoded.id}`, {
              headers: { authorization: accessToken },
            })) as unknown as TResponse<any>;

            if (result.success) {
              const loc = result.data.businessLocation;

              form.setValue("streetAddress", loc.streetAddress || "");
              form.setValue("streetNumber", loc.streetNumber || "");
              form.setValue("city", loc.city || "");
              form.setValue("postalCode", loc.postalCode || "");

              // Geocode saved address and move marker without creating a new map
              const fullAddress = [
                loc.streetNumber,
                loc.streetAddress,
                loc.city,
                loc.postalCode,
              ]
                .filter(Boolean)
                .join(", ");

              if (fullAddress.trim()) {
                geocoder.geocode(
                  { address: fullAddress },
                  (results: any, status: any) => {
                    if (status === "OK" && results[0]) {
                      const location = results[0].geometry.location;
                      map.setCenter(location);
                      map.setZoom(15);
                      markerRef.current.setPosition(location);
                    }
                  }
                );
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }, 400);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (data: LocationFormType) => {
    const toastId = toast.loading("Updating...");
    try {
      const accessToken = getCookie("accessToken");
      const decoded = jwtDecode(accessToken || "") as { id: string };

      const businessLocation = {
        businessLocation: {
          street: data.streetNumber + "; " + data.streetAddress,
          city: data.city,
          postalCode: data.postalCode,
        },
      };

      const result = (await updateData(
        "/vendors/" + decoded?.id,
        businessLocation,
        {
          headers: { authorization: accessToken },
        }
      )) as unknown as TResponse<any>;

      if (result.success) {
        toast.success("Business location updated successfully!", {
          id: toastId,
        });
        router.push("/become-vendor/bank-details");
        return;
      }
      toast.error(result.message, { id: toastId });
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Business location update failed",
        { id: toastId }
      );
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 sm:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative py-1">
        <Button
          onClick={() => router.push("/become-vendor/business-details")}
          variant="link"
          className="inline-flex items-center text-sm gap-2 text-[#DC3173] p-0 px-0! h-4 cursor-pointer absolute -top-6"
        >
          <ArrowLeftCircle /> Go Back
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="space-y-6"
          autoComplete="off"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input
              id="autocomplete"
              placeholder="Search your business address..."
              className="pl-10 py-3 text-base rounded-xl focus-visible:ring-2 focus-visible:ring-[#DC3173] w-full border border-gray-300"
            />
          </div>

          {/* Map */}
          <div
            ref={mapRef}
            className="w-full h-80 rounded-xl shadow-md border border-gray-300"
          />

          {/* Address Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Street Address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="streetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Street Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Postal Code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#DC3173] text-white font-semibold rounded-xl shadow-md hover:bg-[#c42c67] transition"
          >
            <Save className="w-5 h-5" />
            Save Location & Next
          </motion.button>
        </form>
      </Form>
    </motion.div>
  );
};

export default AddYourBusinessLocation;
