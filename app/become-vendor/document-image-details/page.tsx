/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import  { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  ImageIcon,
  File,
  CheckCircle2,
  Eye,
} from "lucide-react";
import Image from "next/image";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


/**
 * Upload mock/demo page
 * - No remote upload; client-side previews only
 * - When all documents selected -> full-screen success modal with confetti
 */

type DocKey =
  | "businessLicenseDoc"
  | "taxDoc"
  | "idProof"
  | "storePhoto"
  | "menuUpload";

const DOCUMENTS: { key: DocKey; label: string; prefersImagePreview: boolean }[] =
  [
    { key: "businessLicenseDoc", label: "Business License", prefersImagePreview: false }, // PDF/name
    { key: "taxDoc", label: "Tax Document", prefersImagePreview: false }, // PDF/name
    { key: "idProof", label: "ID Proof", prefersImagePreview: true }, // image preview ok
    { key: "storePhoto", label: "Store Photo", prefersImagePreview: true },
    { key: "menuUpload", label: "Menu / Brochure", prefersImagePreview: true },
  ];

type FilePreview = {
  file: File;
  url: string | null; // object URL for image preview or null for non-previewables
  isImage: boolean;
};

export default function UploadDemoPage() {
  // store one preview per doc key
  const [previews, setPreviews] = useState<Record<DocKey, FilePreview | null>>({
    businessLicenseDoc: null,
    taxDoc: null,
    idProof: null,
    storePhoto: null,
    menuUpload: null,
  });

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

  // handle file selection (client-side only)
  const handleFileChange = (key: DocKey, f?: File | null) => {
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    const url = isImage ? URL.createObjectURL(f) : null;

    // revoke previous url if present
    const prev = previews[key];
    if (prev && prev.url) URL.revokeObjectURL(prev.url);

    setPreviews((p) => ({ ...p, [key]: { file: f, url, isImage } }));
  };

  // Remove selected file for a doc (and revoke URL)
  const removeFile = (key: DocKey) => {
    const prev = previews[key];
    if (prev && prev.url) URL.revokeObjectURL(prev.url);
    setPreviews((p) => ({ ...p, [key]: null }));
    // ensure modal closed if it was open
    setShowModal(false);
    setConfettiRunning(false);
  };

  // Effect: watch previews, when all five are non-null -> open modal + start confetti
  useEffect(() => {
    const allSelected = DOCUMENTS.every((d) => !!previews[d.key]);
    if (allSelected) {
      setShowModal(true);
      setConfettiRunning(true);
    }
  }, [previews]);

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
      if (confettiAnimRef.current) cancelAnimationFrame(confettiAnimRef.current);
      confettiAnimRef.current = null;
      confettiParticlesRef.current = [];
      const c = ctx.canvas;
      ctx.clearRect(0, 0, c.width, c.height);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (confettiAnimRef.current) cancelAnimationFrame(confettiAnimRef.current);
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
  const handleContinue = () => {
    setConfettiRunning(false);
    setShowModal(false);
    router.push("/become-vendor/registration-status");
    // here you would call your backend to finalize registration
  };

  // small helper to infer file display text
  const fileDisplay = (p: FilePreview | null) => {
    if (!p) return "No file selected";
    if (p.isImage && p.url) return p.file.name;
    return p.file.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-[#DC3173] to-pink-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3 shadow-md">
                <UploadCloud className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold tracking-wide">
                  Upload Your Documents
                </CardTitle>
                <p className="mt-2 text-sm text-white/90 max-w-2xl leading-relaxed">
                  Select each required document. Once all 5 are selected, you will see the registration success modal.
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
                      isSelected ? "border-[#DC3173]/30 bg-[#FFF7FB]" : "bg-white"
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
                            d.prefersImagePreview && preview.isImage && preview.url ? (
                              <div className="flex items-center gap-2">
                                <Image
                                  src={preview.url}
                                  alt={preview.file.name}
                                  width={56}
                                  height={40}
                                  className="object-cover rounded-md border"
                                  unoptimized
                                />
                                <div className="truncate">{preview.file.name}</div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <File className="w-4 h-4 text-gray-500" />
                                <div className="truncate">{preview.file.name}</div>
                              </div>
                            )
                          ) : (
                            <span>No file selected</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* hidden native input */}
                      <input
                        ref={(el) => { inputsRef.current[d.key] = el; }}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(d.key, e.target.files ? e.target.files[0] : null)
                        }
                      />

                      {preview ? (
                        <>
                          <button
                            onClick={() =>
                              // preview in new tab if image or show filename
                              preview.isImage && preview.url
                                ? window.open(preview.url, "_blank")
                                : alert(preview.file.name)
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-200 hover:shadow"
                          >
                            <Eye className="w-4 h-4 text-[#DC3173]" /> View
                          </button>

                          <button
                            onClick={() => removeFile(d.key)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-600 border border-gray-100 hover:bg-gray-50"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openPicker(d.key)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#DC3173] border border-[#DC3173]/20 hover:bg-[#DC3173]/5 transition"
                        >
                          <UploadCloud className="w-4 h-4" />
                          Select file
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-6">
              <div className="text-sm text-gray-500">
                Tip: you can preview images and view filenames for selected PDFs. This is a demo UI — upload handling can be hooked later.
              </div>
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
              style={{ width: "100%", height: "100%" }}
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
                  🎉 Registration Complete
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  All your documents have been uploaded successfully!
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button
                    onClick={handleContinue}
                    className="bg-[#DC3173] hover:bg-[#b72a63] text-white px-6 py-3 rounded-xl shadow-lg"
                  >
                    Continue
                  </Button>

                  <button
                    onClick={() => {
                      // close modal but keep confetti running? spec said confetti stops on Continue, so here we stop too
                      setConfettiRunning(false);
                      setShowModal(false);
                      router.push("/");
                      
                    }}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm"
                  >
                    Maybe later
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
