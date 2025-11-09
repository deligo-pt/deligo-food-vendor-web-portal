/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { updateData } from "@/src/utils/requests";
import { businessLocationValidation } from "@/src/validations/become-vendor/business-location.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

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
};

const AddYourBusinessLocation = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const router = useRouter();
  const form = useForm<LocationFormType>({
    resolver: zodResolver(businessLocationValidation),
    defaultValues: {
      streetAddress: "",
      streetNumber: "",
      city: "",
      postalCode: "",
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

    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initMap();
        clearInterval(interval);
      }
    }, 400);

    const initMap = () => {
      const defaultLocation = { lat: 40.4168, lng: -3.7038 }; // Madrid for example

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

      // SEARCH AUTOCOMPLETE
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

        fillAddressFields(place.address_components);
      });

      // MAP CLICK LISTENER
      map.addListener("click", (e: any) => {
        const clickedLocation = e.latLng;
        markerRef.current.setPosition(clickedLocation);
        map.setCenter(clickedLocation);

        geocoder.geocode(
          { location: clickedLocation },
          (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              const addressComponents = results[0].address_components;
              fillAddressFields(addressComponents);
            }
          }
        );
      });
    };

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
        }
      });

      // UPDATE FORM VALUES
      form.setValue("streetAddress", address.streetAddress || "");
      form.setValue("streetNumber", address.streetNumber || "");
      form.setValue("city", address.city || "");
      form.setValue("postalCode", address.postalCode || "");
    };
  }, []);

  const handleSave = async (data: LocationFormType) => {
    try {
      const result = (await updateData(
        "/vendors/" + id,
        {
          companyLocation: data,
        },
        {
          headers: { authorization: getCookie("accessToken") },
        }
      )) as unknown as TResponse<any>;

      if (result.success) {
        router.push("/become-vendor/bank-details?id=" + id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 sm:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
              className="pl-10 py-3 text-base rounded-xl focus-visible:ring-2 focus-visible:ring-[#DC3173] w-full"
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
