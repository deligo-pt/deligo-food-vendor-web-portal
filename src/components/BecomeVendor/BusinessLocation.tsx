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
import { Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import { ArrowLeftCircle, Save, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type LocationFormType = {
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};


const BusinessLocation = ({ vendor }: { vendor: TVendor }) => {
  const { t } = useTranslation();
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
    { label: "Latitude", name: "latitude" },
    { label: "Longitude", name: "longitude" },
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

  const { formState: { isSubmitting } } = form;

  const map = useMap();
  const places = useMapsLibrary("places");

  const inputRef = useRef<HTMLInputElement>(null);

  const defaultLocation = { lat: 38.7223, lng: -9.1393 };

  const [position, setPosition] = useState({
    lat: vendor?.businessLocation?.latitude ?? defaultLocation.lat,
    lng: vendor?.businessLocation?.longitude ?? defaultLocation.lng,
  });

  const fillAddressFields = useCallback(
    (components: google.maps.GeocoderAddressComponent[]) => {
      let streetNumber = "";
      let route = "";

      const address: Partial<LocationFormType> = {};

      components.forEach((component) => {
        console.log("component", component);
        const types = component.types;

        if (types.includes("street_number")) {
          streetNumber = component.long_name;
        }

        if (types.includes("route")) {
          route = component.long_name;
        }

        if (types.includes("locality")) {
          address.city = component.long_name;
        }

        if (types.includes("postal_code")) {
          address.postalCode = component.long_name;
        }

        if (types.includes("country")) {
          address.country = component.long_name;
        }
      });

      address.streetAddress = `${streetNumber} ${route}`.trim();

      Object.entries(address).forEach(([key, value]) => {
        form.setValue(key as keyof LocationFormType, value ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    },
    [form],
  );

  // Reverse geocode (for map drag/select)
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google?.maps) return;

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        {
          location: { lat, lng },
        },
        (results, status) => {
          if (
            status === "OK" &&
            results &&
            results.length > 0
          ) {
            fillAddressFields(results[0].address_components);
          }
        },
      );
    },
    [fillAddressFields],
  );

  // SEARCH + INIT AUTOCOMPLETE
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "address_components"],
      types: ["address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const newPos = { lat, lng };

      setPosition(newPos);

      map?.panTo(newPos);
      map?.setZoom(16);
      setLocationCoordinates({ latitude: lat, longitude: lng });

      form.setValue("latitude", lat);
      form.setValue("longitude", lng);

      // map?.panTo(newPos);
      // map?.setZoom(16);

      fillAddressFields(place.address_components || []);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    });
  }, [places, map, fillAddressFields, setLocationCoordinates, form]);

  useEffect(() => {
    if (!vendor?.businessLocation) return;

    const latitude = vendor.businessLocation.latitude || 0;
    const longitude = vendor.businessLocation.longitude || 0;

    form.reset({
      streetAddress: vendor.businessLocation.street || "",
      city: vendor.businessLocation.city || "",
      postalCode: vendor.businessLocation.postalCode || "",
      country: vendor.businessLocation.country || "",
      latitude,
      longitude,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocationCoordinates({
      latitude,
      longitude,
    });
  }, [vendor, form]);

  /** --- Submit Handler --- */
  const handleSave = async (data: Partial<LocationFormType>) => {
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
        >

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search address here..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              className="pl-10 py-3 rounded-xl border w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* MAP */}
          <div className="w-full h-80 rounded-xl shadow-md border overflow-hidden">
            <Map
              center={position}
              zoom={14}
              gestureHandling="greedy"
              disableDefaultUI
              onClick={(event) => {
                if (!event.detail?.latLng) return;

                const lat = event.detail.latLng.lat;
                const lng = event.detail.latLng.lng;

                setPosition({ lat, lng });

                setLocationCoordinates({
                  latitude: lat,
                  longitude: lng,
                });

                form.setValue("latitude", lat);
                form.setValue("longitude", lng);

                reverseGeocode(lat, lng);
              }}
            >
              <Marker position={position} />
            </Map>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control as any}
                name={field.name as keyof LocationFormType}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        readOnly={
                          field.name === "latitude" ||
                          field.name === "longitude"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center gap-2 px-6 py-3 bg-[#DC3173] text-white rounded-xl ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <Save className="w-5 h-5" /> {t("saveLocationNext")}
          </motion.button>
        </form>
      </Form>
    </motion.div>
  );
};

export default BusinessLocation;
