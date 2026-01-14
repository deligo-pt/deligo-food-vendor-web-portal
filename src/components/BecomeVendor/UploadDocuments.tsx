/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftCircle,
  CheckCircle2,
  Eye,
  File,
  FileText,
  ImageIcon,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useTranslation } from "@/src/hooks/use-translation";
import { submitForApprovalReq } from "@/src/services/becomeVendor/become-vendor";
import { uploadDocumentsReq } from "@/src/services/becomeVendor/uploadDocumentsReq";
import { TResponse } from "@/src/types";
import { DocKey, FilePreview } from "@/src/types/documents.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Upload mock/demo page
 * - No remote upload; client-side previews only
 * - When all documents selected -> full-screen success modal with confetti
 */
interface IDoc {
  key: DocKey;
  label: string;
  prefersImagePreview: boolean;
}

export default function UploadDocuments({
  savedPreviews,
  vendorId,
}: {
  savedPreviews: Record<DocKey, FilePreview | null>;
  vendorId: string;
}) {
  const { t } = useTranslation();
  // store one preview per doc key
  const [previews, setPreviews] =
    useState<Record<DocKey, FilePreview | null>>(savedPreviews);

  // file input refs to trigger the browser picker
  const inputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  // modal open state (auto-opened when all files selected)
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  // whether confetti should be running (true until user clicks Continue)
  const [confettiRunning, setConfettiRunning] = useState(false);

  // confetti canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiAnimRef = useRef<number | null>(null);
  const confettiParticlesRef = useRef<any[]>([]);

  // helper to open file input for a specific doc
  const openPicker = (key: DocKey) => {
    const el = inputsRef.current[key];
    el?.click();
  };

  const DOCUMENTS: IDoc[] = [
    {
      key: "businessLicenseDoc",
      label: t("documentsLabel1"),
      prefersImagePreview: false,
    }, // PDF/name
    { key: "taxDoc", label: t("documentsLabel2"), prefersImagePreview: false }, // PDF/name
    { key: "idProofFront", label: "ID Proof Front", prefersImagePreview: true }, // image preview ok
    { key: "idProofBack", label: "ID Proof Back ", prefersImagePreview: true }, // image preview ok
    {
      key: "storePhoto",
      label: t("documentsLabel4"),
      prefersImagePreview: true,
    },
    {
      key: "menuUpload",
      label: t("documentsLabel5"),
      prefersImagePreview: true,
    },
  ];

  // handle file selection (client-side only)
  const handleFileChange = async (key: DocKey, f?: File | null) => {
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    const url = URL.createObjectURL(f);

    const toastId = toast.loading("Uploading...");

    const result = (await uploadDocumentsReq(
      vendorId,
      key,
      f
    )) as unknown as TResponse<any>;

    if (result.success) {
      toast.success("File uploaded successfully!", { id: toastId });

      // revoke previous url if present
      const prev = previews[key];
      if (prev && prev.url) URL.revokeObjectURL(prev.url);

      setPreviews((p) => ({ ...p, [key]: { file: f, url, isImage } }));

      if (inputsRef.current[key]) {
        inputsRef.current[key]!.value = "";
      }
      return;
    }

    toast.error(result.message || "File upload failed", { id: toastId });
    console.log(result);
  };

  // Remove selected file for a doc (and revoke URL)
  const removeFile = (key: DocKey) => {
    const prev = previews[key];
    if (prev && prev.url) URL.revokeObjectURL(prev.url);
    setPreviews((p) => ({ ...p, [key]: null }));

    if (inputsRef.current[key]) {
      inputsRef.current[key]!.value = "";
    }

    setShowModal(false);
    setConfettiRunning(false);
  };

  // CONFETTI: simple canvas confetti implementation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // adjust size to viewport
    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // create particles
    function createParticles(count = 120) {
      const c = canvasRef.current;
      if (!c) {
        confettiParticlesRef.current = [];
        return;
      }
      const colors = ["#DC3173", "#FF7AB6", "#FFD1E6", "#FFC2D6", "#7C3AED"];
      const arr: any[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * c.width,
          y: Math.random() * -c.height * 0.2,
          w: 6 + Math.random() * 8,
          h: 8 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          speedY: 2 + Math.random() * 6,
          speedX: Math.random() * 4 - 2,
          tilt: Math.random() * 0.5,
        });
      }
      confettiParticlesRef.current = arr;
    }

    function draw() {
      if (!ctx) return;
      const c = ctx.canvas;
      ctx.clearRect(0, 0, c.width, c.height);
      const particles = confettiParticlesRef.current;
      for (let p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        // draw rectangle confetti
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        // update
        p.y += p.speedY + Math.sin(p.tilt * 10);
        p.x += p.speedX;
        p.rotation += 4;
        if (p.y > c.height + 20) {
          // recycle to top
          p.y = -10 - Math.random() * 100;
          p.x = Math.random() * c.width;
        }
      }
    }

    function animate() {
      draw();
      confettiAnimRef.current = requestAnimationFrame(animate);
    }

    if (confettiRunning) {
      createParticles(160);
      animate();
    } else {
      // stop animation and clear particles
      if (confettiAnimRef.current)
        cancelAnimationFrame(confettiAnimRef.current);
      confettiAnimRef.current = null;
      confettiParticlesRef.current = [];
      const c = ctx.canvas;
      ctx.clearRect(0, 0, c.width, c.height);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (confettiAnimRef.current)
        cancelAnimationFrame(confettiAnimRef.current);
    };
    // intentionally watching confettiRunning only
  }, [confettiRunning]);

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((p) => {
        if (p && p.url) URL.revokeObjectURL(p.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Continue button handler: stop confetti and close modal (later you can trigger API)
  const handleContinue = async () => {
    const toastId = toast.loading("Submitting...");

    const result = await submitForApprovalReq(vendorId);

    if (result.success) {
      toast.success("Request submitted successfully!", {
        id: toastId,
      });
      setConfettiRunning(true);
      setShowModal(true);
      return;
    }

    toast.error(result.message || "Request submission failed", {
      id: toastId,
    });
    console.log(result);
  };

  function getActualFileName(url: string): string {
    try {
      const decoded = decodeURIComponent(url);
      const lastSegment = decoded.split("/").pop() || "";
      const match = lastSegment.match(/file-(.+)$/);
      return match ? match[1] : lastSegment;
    } catch {
      return "";
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative">
          <div className="relative p-0">
            <Button
              onClick={() => router.push("/become-vendor/bank-details")}
              variant="link"
              className="inline-flex items-center px-4 text-sm gap-2 text-[#DC3173] p-0 h-4 absolute -top-2 z-10 cursor-pointer"
            >
              <ArrowLeftCircle /> {t("goBack")}
            </Button>
          </div>
          <CardHeader className="bg-linear-to-r from-[#DC3173] to-pink-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3 shadow-md">
                <UploadCloud className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold tracking-wide">
                  {t("uploadDocuments")}
                </CardTitle>
                <p className="mt-2 text-sm text-white/90 max-w-2xl leading-relaxed">
                  {t("uploadDocDesc")}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="bg-white p-8 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {DOCUMENTS.map((d, idx) => {
                const preview = previews[d.key];
                const isSelected = !!preview;
                return (
                  <motion.div
                    key={d.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className={`flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition-all ${
                      isSelected
                        ? "border-[#DC3173]/30 bg-[#FFF7FB]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-[#DC3173]/10" : "bg-gray-50"
                        }`}
                      >
                        {d.prefersImagePreview ? (
                          <ImageIcon className="w-6 h-6 text-[#DC3173]" />
                        ) : (
                          <FileText className="w-6 h-6 text-[#DC3173]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-800">
                          {d.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {preview ? (
                            preview.isImage && preview.url ? (
                              <div className="flex items-center gap-2">
                                <Image
                                  src={preview.url}
                                  alt={
                                    preview.file?.name ||
                                    getActualFileName(preview.url || "")
                                  }
                                  width={56}
                                  height={40}
                                  className="object-cover rounded-md border"
                                  unoptimized
                                />
                                <div className="truncate">
                                  {preview.file?.name ||
                                    getActualFileName(preview.url || "")}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <File className="w-4 h-4 text-gray-500" />
                                <div className="truncate">
                                  {preview.file?.name ||
                                    getActualFileName(preview.url || "")}
                                </div>
                              </div>
                            )
                          ) : (
                            <span>{t("noFileSelected")}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* hidden native input */}
                      <input
                        ref={(el) => {
                          inputsRef.current[d.key] = el;
                        }}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(
                            d.key,
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />

                      {preview ? (
                        <>
                          <button
                            onClick={() =>
                              preview.url
                                ? window.open(preview.url, "_blank")
                                : alert(preview.file?.name)
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-200 hover:shadow"
                          >
                            <Eye className="w-4 h-4 text-[#DC3173]" />{" "}
                            {t("viewCTA")}
                          </button>

                          <button
                            onClick={() => removeFile(d.key)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-600 border border-gray-100 hover:bg-gray-50"
                          >
                            {t("removeCTA")}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openPicker(d.key)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#DC3173] border border-[#DC3173]/20 hover:bg-[#DC3173]/5 transition"
                        >
                          <UploadCloud className="w-4 h-4" />
                          {t("selectFileCTA")}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-6">
              <div className="text-sm text-gray-500">{t("tipDesc")}.</div>
            </div>
            <div className="pt-4">
              <Button
                disabled={!DOCUMENTS.every((d) => !!previews[d.key])}
                onClick={handleContinue}
                className="bg-[#DC3173] hover:bg-[#b72a63] text-white px-6 py-3 rounded-xl shadow-lg"
              >
                {t("completeRegistrationCTA")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full-screen success modal + confetti */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* dim layer */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black z-40"
            />

            {/* confetti canvas covers entire screen */}
            <canvas
              ref={canvasRef}
              className="fixed inset-0 pointer-events-none z-50"
              style={{ width: "100vw", height: "100vh" }}
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-[#DC3173]/10 p-4">
                    <CheckCircle2 className="w-12 h-12 text-[#DC3173]" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("registrationComplete")}
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  {t("registrationCompleteDesc")}
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button
                    onClick={() =>
                      router.push("/become-vendor/registration-status")
                    }
                    className="bg-[#DC3173] hover:bg-[#b72a63] text-white px-6 py-3 rounded-xl shadow-lg"
                  >
                    {t("seeRegistrationStatus")}
                  </Button>

                  <button
                    onClick={() => {
                      setConfettiRunning(false);
                      setShowModal(false);
                      router.push("/");
                    }}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm"
                  >
                    {t("goHome")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
