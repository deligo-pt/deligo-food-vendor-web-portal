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
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import { updateVendorReq } from "@/src/services/becomeVendor/become-vendor";
import { TVendor } from "@/src/types/vendor.type";
import { businessLocationValidation } from "@/src/validations/become-vendor/business-location.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeftCircle, Save, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

declare global {
  interface Window {
    google: any;
  }
}

type LocationFormType = {
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
};

const GOOGLE_API_URL = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBHT9ARgpTJIEdvsiaD72Gf7SUUXz-Xqfg&libraries=places`;

const BusinessLocation = ({ vendor }: { vendor: TVendor }) => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const router = useRouter();

  const [locationCoordinates, setLocationCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const formFields = [
    {
      label: t("streetAddress"),
      name: "streetAddress",
    },
    {
      label: t("city"),
      name: "city",
    },
    {
      label: t("postalCode"),
      name: "postalCode",
    },
    {
      label: t("country"),
      name: "country",
    },
  ];

  const form = useForm<LocationFormType>({
    resolver: zodResolver(businessLocationValidation),
    defaultValues: {
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  /** --- Extract and Set Address Fields --- */
  const fillAddressFields = useCallback(
    (components: any[]) => {
      const address: any = {};
      components.forEach((c) => {
        if (c.types.includes("route")) address.streetAddress = c.long_name;
        if (c.types.includes("street_number"))
          address.streetNumber = c.long_name;
        if (c.types.includes("locality")) address.city = c.long_name;
        if (c.types.includes("postal_code")) address.postalCode = c.long_name;
        if (c.types.includes("country")) address.country = c.long_name;
      });

      Object.entries(address).forEach(([key, value]) =>
        form.setValue(key as keyof LocationFormType, (value || "") as string)
      );
    },
    [form]
  );

  /** --- Update Marker Position --- */
  const updateMarker = useCallback((map: any, location: any) => {
    markerRef.current.setPosition(location);
    map.setCenter(location);
    map.setZoom(15);
  }, []);

  /** --- Initialize Google Map & Autocomplete --- */
  const initializeMap = useCallback(async () => {
    if (!window.google?.maps) return;

    const defaultLocation = { lat: 40.4168, lng: -3.7038 }; // Madrid
    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
    });

    geocoderRef.current = new window.google.maps.Geocoder();

    markerRef.current = new window.google.maps.Marker({
      map,
      position: defaultLocation,
      animation: window.google.maps.Animation.DROP,
    });

    /** Autocomplete */
    const input = document.getElementById("autocomplete") as HTMLInputElement;
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      fields: ["address_components", "geometry"],
      types: ["address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const loc = place.geometry.location;

      setLocationCoordinates({ latitude: loc.lat(), longitude: loc.lng() });
      updateMarker(map, loc);
      fillAddressFields(place.address_components);
    });

    /** On Map Click */
    map.addListener("click", (e: any) => {
      const loc = e.latLng;
      setLocationCoordinates({ latitude: loc.lat(), longitude: loc.lng() });

      geocoderRef.current.geocode(
        { location: loc },
        (results: any, status: string) => {
          if (status === "OK" && results[0]) {
            updateMarker(map, loc);
            fillAddressFields(results[0].address_components);
          }
        }
      );
    });

    /** Load Saved Vendor Location */
    const loc = vendor.businessLocation;
    form.reset({
      streetAddress: loc?.street || "",
      city: loc?.city || "",
      postalCode: loc?.postalCode || "",
      country: loc?.country || "",
    });

    if (loc?.latitude && loc?.longitude) {
      const savedLoc = new window.google.maps.LatLng(
        loc?.latitude,
        loc?.longitude
      );
      setLocationCoordinates({
        latitude: loc?.latitude,
        longitude: loc?.longitude,
      });
      updateMarker(map, savedLoc);
    }
  }, [fillAddressFields, form, updateMarker, vendor]);

  /** --- Load Google Maps Script Once --- */
  useEffect(() => {
    if (document.querySelector(`script[src="${GOOGLE_API_URL}"]`)) {
      (() => initializeMap())();
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_API_URL;
    script.async = true;
    script.onload = initializeMap;
    document.body.appendChild(script);
  }, [initializeMap]);

  /** --- Submit Handler --- */
  const handleSave = async (data: LocationFormType) => {
    if (!locationCoordinates.latitude || !locationCoordinates.longitude) {
      toast.error("Please select a location on the map");
      return;
    }

    const toastId = toast.loading("Updating...");

    const payload = {
      businessLocation: {
        street: data.streetAddress,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        latitude: locationCoordinates.latitude,
        longitude: locationCoordinates.longitude,
      },
    };

    const result = await updateVendorReq(vendor?.userId, payload);

    if (result.success) {
      toast.success("Business location updated!", { id: toastId });
      router.push("/become-vendor/bank-details");
      return;
    }

    toast.error(result.message || "Business location update failed", {
      id: toastId,
    });
    console.log(result);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 sm:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        onClick={() => router.push("/become-vendor/business-details")}
        variant="link"
        className="inline-flex items-center gap-2 text-[#DC3173] absolute top-0.5 px-0! cursor-pointer"
      >
        <ArrowLeftCircle /> {t("goBack")}
      </Button>

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
              className="pl-10 py-3 rounded-xl border w-full"
            />
          </div>

          <div
            ref={mapRef}
            className="w-full h-80 rounded-xl shadow-md border"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof LocationFormType}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input {...formField} placeholder={field.label} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#DC3173] text-white rounded-xl"
          >
            <Save className="w-5 h-5" /> {t("saveLocationNext")}
          </motion.button>
        </form>
      </Form>
    </motion.div>
  );
};

export default BusinessLocation;
