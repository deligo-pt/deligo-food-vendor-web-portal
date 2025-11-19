
"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";


import {
 
  Moon,
  Sun,
  Settings,
  ImagePlus,
  
  Save,
  Upload,
  Trash2,
  Smartphone,
  Layout,
  Download,
  UploadCloud,
} from "lucide-react";

const DELIGO = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 6px 20px rgba(0,0,0,0.06)";

type LayoutPreset = "standard" | "compact" | "split";

type ThemeState = {
  darkMode: boolean;
  roundedUI: boolean;
  brandColor: string;
  font: string;
  backgroundDataUrl: string | null;
  logoDataUrl: string | null;
  coverDataUrl: string | null;
  buttonRadius: number;
  buttonPadding: number;
  buttonShadow: boolean;
  layoutPreset: LayoutPreset;
};

export default function VendorThemeSettingsFull() {
  const [theme, setTheme] = useState<ThemeState>({
    darkMode: false,
    roundedUI: true,
    brandColor: DELIGO,
    font: "Inter",
    backgroundDataUrl: null,
    logoDataUrl: null,
    coverDataUrl: null,
    buttonRadius: 12,
    buttonPadding: 12,
    buttonShadow: true,
    layoutPreset: "standard",
  });

  // file inputs refs
  const bgInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  // helper: read file -> dataURL
  const readFileAsDataURL = (file: File) =>
    new Promise<string>((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });

  // upload handlers
  const onUploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await readFileAsDataURL(f);
    setTheme((t) => ({ ...t, backgroundDataUrl: url }));
  };

  const onUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await readFileAsDataURL(f);
    setTheme((t) => ({ ...t, logoDataUrl: url }));
  };

  const onUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await readFileAsDataURL(f);
    setTheme((t) => ({ ...t, coverDataUrl: url }));
  };

  const removeBackground = () => setTheme((t) => ({ ...t, backgroundDataUrl: null }));
  const removeLogo = () => setTheme((t) => ({ ...t, logoDataUrl: null }));
  const removeCover = () => setTheme((t) => ({ ...t, coverDataUrl: null }));

  // export theme settings as JSON
  const exportTheme = () => {
    const payload = { ...theme };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deligo-theme.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // import theme JSON
  const onImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const parsed = JSON.parse(String(fr.result));
        // basic validation & assign
        const newTheme: Partial<ThemeState> = {};
        if (typeof parsed.darkMode === "boolean") newTheme.darkMode = parsed.darkMode;
        if (typeof parsed.roundedUI === "boolean") newTheme.roundedUI = parsed.roundedUI;
        if (typeof parsed.brandColor === "string") newTheme.brandColor = parsed.brandColor;
        if (typeof parsed.font === "string") newTheme.font = parsed.font;
        if (typeof parsed.backgroundDataUrl === "string") newTheme.backgroundDataUrl = parsed.backgroundDataUrl;
        if (typeof parsed.logoDataUrl === "string") newTheme.logoDataUrl = parsed.logoDataUrl;
        if (typeof parsed.coverDataUrl === "string") newTheme.coverDataUrl = parsed.coverDataUrl;
        if (typeof parsed.buttonRadius === "number") newTheme.buttonRadius = parsed.buttonRadius;
        if (typeof parsed.buttonPadding === "number") newTheme.buttonPadding = parsed.buttonPadding;
        if (typeof parsed.buttonShadow === "boolean") newTheme.buttonShadow = parsed.buttonShadow;
        if (["standard", "compact", "split"].includes(parsed.layoutPreset)) newTheme.layoutPreset = parsed.layoutPreset;
        setTheme((t) => ({ ...t, ...(newTheme as ThemeState) }));
      } catch (err) {
        alert("Invalid theme JSON");
      }
    };
    fr.readAsText(f);
  };

  // apply quick preset (example presets)
  const applyPreset = (preset: LayoutPreset) => {
    if (preset === "standard") {
      setTheme((t) => ({ ...t, layoutPreset: "standard", buttonRadius: 12, buttonPadding: 12 }));
    } else if (preset === "compact") {
      setTheme((t) => ({ ...t, layoutPreset: "compact", buttonRadius: 8, buttonPadding: 8 }));
    } else {
      // split
      setTheme((t) => ({ ...t, layoutPreset: "split", buttonRadius: 16, buttonPadding: 14 }));
    }
  };

  // small helper for style strings
  const previewCardStyle: React.CSSProperties = {
    background: theme.backgroundDataUrl ? `url(${theme.backgroundDataUrl}) center/cover no-repeat` : theme.darkMode ? "#111827" : "#fafafa",
    color: theme.darkMode ? "#fff" : "#111827",
    borderRadius: theme.roundedUI ? 20 : 6,
    fontFamily: theme.font,
  };

  const sampleButtonStyle: React.CSSProperties = {
    background: theme.brandColor,
    borderRadius: theme.buttonRadius,
    padding: `${theme.buttonPadding}px ${theme.buttonPadding * 1.6}px`,
    boxShadow: theme.buttonShadow ? "0 8px 24px rgba(220,49,115,0.16)" : "none",
  };

  // Save to localStorage (demo) - for persistent demo across reloads
  const saveToLocal = () => {
    localStorage.setItem("deligo_theme_v1", JSON.stringify(theme));
    alert("Theme saved locally (demo). For production, store on server.");
  };

  const loadFromLocal = () => {
    const raw = localStorage.getItem("deligo_theme_v1");
    if (!raw) return alert("No saved theme in localStorage");
    try {
      const parsed = JSON.parse(raw);
      setTheme((t) => ({ ...t, ...(parsed as ThemeState) }));
      alert("Loaded theme from localStorage (demo).");
    } catch {
      alert("Failed to load theme from localStorage");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: DELIGO }}>
              Theme Settings — Advanced
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Full customization: brand, layout, preview, import/export.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={exportTheme} className="flex items-center gap-2">
              <Download size={16} /> Export JSON
            </Button>

            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              onChange={onImportJson}
              className="hidden"
            />
            <Button onClick={() => importInputRef.current?.click()} variant="outline" className="flex items-center gap-2">
              <UploadCloud size={16} /> Import JSON
            </Button>

            <Button onClick={saveToLocal} className="bg-rose-500 text-white flex items-center gap-2">
              Save (Local)
            </Button>

            <Button onClick={loadFromLocal} variant="outline" className="flex items-center gap-2">
              Load (Local)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Preview + Mobile Preview */}
          <div className="col-span-2 space-y-6">
            {/* LIVE PREVIEW CARD */}
            <Card className="rounded-3xl bg-white border" style={{ boxShadow: SHADOW }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg flex items-center gap-2"><Settings size={18} /> Live Preview</h2>
                  <div className="text-sm text-gray-500">Layout: <strong className="ml-1 text-gray-700">{theme.layoutPreset}</strong></div>
                </div>

                <div className="p-4 rounded-2xl" style={previewCardStyle}>
                  {/* cover */}
                  {theme.coverDataUrl ? (
                    <div className="w-full h-36 rounded-lg overflow-hidden mb-4">
                      <img src={theme.coverDataUrl} alt="cover" className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  {/* header row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {theme.logoDataUrl ? (
                        <img src={theme.logoDataUrl} alt="logo" className="w-12 h-12 object-contain rounded-md" />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: theme.brandColor, fontWeight: 700 }}>DG</span>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{/* brand name sample */}Deligo Vendor</div>
                        <div style={{ fontSize: 12, opacity: 0.85 }}>Lisbon • Open now</div>
                      </div>
                    </div>

                    <div>
                      <button style={sampleButtonStyle as React.CSSProperties} className="text-white font-semibold">
                        Action
                      </button>
                    </div>
                  </div>

                  {/* sample content rows */}
                  <div className={`grid gap-4 ${theme.layoutPreset === "compact" ? "grid-cols-2" : theme.layoutPreset === "split" ? "grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
                    <div className="p-3 rounded-xl bg-white/70">
                      <div className="text-sm font-medium">Orders</div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/70">
                      <div className="text-sm font-medium">Revenue</div>
                      <div className="text-2xl font-bold">€842</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/70">
                      <div className="text-sm font-medium">Avg time</div>
                      <div className="text-2xl font-bold">22m</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button onClick={() => setTheme((t) => ({ ...t, darkMode: !t.darkMode }))} variant="outline">Toggle Dark</Button>
                  <Button onClick={() => setTheme((t) => ({ ...t, roundedUI: !t.roundedUI }))} variant="outline">Toggle Rounded</Button>
                </div>
              </CardContent>
            </Card>

            {/* MOBILE PREVIEW */}
            <Card className="rounded-3xl bg-white border" style={{ boxShadow: SHADOW }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg flex items-center gap-2"><Smartphone size={18} /> Mobile Preview</h2>
                  <div className="text-sm text-gray-500">Simulated phone</div>
                </div>

                <div className="flex items-center justify-center">
                  <div
                    className="w-[260px] h-[540px] border bg-white rounded-3xl overflow-hidden shadow-lg"
                    style={{
                      borderColor: "#e5e7eb",
                      ... (theme.darkMode ? { background: "#0f172a", color: "#fff" } : {}),
                    } as React.CSSProperties}
                  >
                    {/* inner phone header */}
                    <div style={{ padding: 12 }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {theme.logoDataUrl ? (
                            <img src={theme.logoDataUrl} alt="logo" className="w-9 h-9 object-contain rounded-md" />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ color: theme.brandColor, fontWeight: 700 }}>DG</span>
                            </div>
                          )}
                          <div style={{ fontWeight: 700 }}>Deligo</div>
                        </div>

                        <div>
                          <div style={{ ...sampleButtonStyle as React.CSSProperties, padding: "6px 10px", fontSize: 12 }}>Action</div>
                        </div>
                      </div>

                      {theme.coverDataUrl ? (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img src={theme.coverDataUrl} alt="cover" className="w-full h-28 object-cover" />
                        </div>
                      ) : null}

                      <div className="mt-3 space-y-2">
                        <div className="rounded-xl p-2" style={{ background: theme.darkMode ? "#0b1220" : "#f8fafc" }}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm">Orders</div>
                              <div className="font-bold">24</div>
                            </div>
                            <div>
                              <div className="text-sm">€</div>
                              <div className="font-bold">842</div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl p-2" style={{ background: theme.darkMode ? "#0b1220" : "#f8fafc" }}>
                          <div className="text-sm">Next</div>
                          <div className="font-bold">Chicken Burger</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Controls */}
          <div className="space-y-6">
            {/* Basic Toggles */}
            <Card className="rounded-3xl bg-white border" style={{ boxShadow: SHADOW }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon size={18} /> <div>Dark Mode</div>
                  </div>
                  <Switch checked={theme.darkMode} onCheckedChange={(v) => setTheme((t) => ({ ...t, darkMode: !!v }))} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sun size={18} /> <div>Rounded UI</div>
                  </div>
                  <Switch checked={theme.roundedUI} onCheckedChange={(v) => setTheme((t) => ({ ...t, roundedUI: !!v }))} />
                </div>

                <Separator />

                {/* Brand color */}
                <div>
                  <label className="font-medium text-sm">Brand Color</label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.brandColor}
                      onChange={(e) => setTheme((t) => ({ ...t, brandColor: e.target.value }))}
                      className="w-12 h-10 rounded-md border"
                    />
                    <input
                      value={theme.brandColor}
                      onChange={(e) => setTheme((t) => ({ ...t, brandColor: e.target.value }))}
                      className="border rounded-md px-2 py-2 w-full text-sm"
                    />
                  </div>
                </div>

                {/* Font */}
                <div>
                  <label className="font-medium text-sm">Font</label>
                  <select
                    value={theme.font}
                    onChange={(e) => setTheme((t) => ({ ...t, font: e.target.value }))}
                    className="w-full mt-2 h-10 rounded-md border px-2"
                  >
                    <option>Inter</option>
                    <option>Poppins</option>
                    <option>Roboto</option>
                    <option>Nunito</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Button Style Controls */}
            <Card className="rounded-3xl bg-white border" style={{ boxShadow: SHADOW }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><ImagePlus size={18} /> Button Style</div>
                  <div className="text-sm text-gray-500">Preview below</div>
                </div>

                <div>
                  <label className="text-sm font-medium">Radius ({theme.buttonRadius}px)</label>
                  <input
                    type="range"
                    min={0}
                    max={28}
                    value={theme.buttonRadius}
                    onChange={(e) => setTheme((t) => ({ ...t, buttonRadius: Number(e.target.value) }))}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Padding ({theme.buttonPadding}px)</label>
                  <input
                    type="range"
                    min={6}
                    max={24}
                    value={theme.buttonPadding}
                    onChange={(e) => setTheme((t) => ({ ...t, buttonPadding: Number(e.target.value) }))}
                    className="w-full mt-2"
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">Shadow</div>
                  <Switch checked={theme.buttonShadow} onCheckedChange={(v) => setTheme((t) => ({ ...t, buttonShadow: !!v }))} />
                </div>

                <div className="mt-3 flex justify-center">
                  <button style={sampleButtonStyle as React.CSSProperties} className="text-white font-semibold">
                    Sample Button
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Layout Presets */}
            <Card className="rounded-3xl bg-white border" style={{ boxShadow: SHADOW }}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Layout size={18} /> Layout Presets</div>
                  <div className="text-sm text-gray-500">Choose</div>
                </div>

                <div className="grid gap-2">
                  <button
                    onClick={() => applyPreset("standard")}
                    className={`text-left p-3 rounded-lg border ${theme.layoutPreset === "standard" ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
                  >
                    Standard — Balanced cards & spacing
                  </button>

                  <button
                    onClick={() => applyPreset("compact")}
                    className={`text-left p-3 rounded-lg border ${theme.layoutPreset === "compact" ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
                  >
                    Compact — Denser info (more items per view)
                  </button>

                  <button
                    onClick={() => applyPreset("split")}
                    className={`text-left p-3 rounded-lg border ${theme.layoutPreset === "split" ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
                  >
                    Split View — Multi-column dashboard
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Branding Uploads */}
            <Card className="rounded-3xl bg-white border" style={{ boxShadow: SHADOW }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><ImagePlus size={18} /> Branding</div>
                  <div className="text-sm text-gray-500">Logo & Cover</div>
                </div>

                {/* Logo upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden border">
                      {theme.logoDataUrl ? (
                        <img src={theme.logoDataUrl} alt="logo" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">No logo</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input ref={logoInputRef} type="file" accept="image/*" onChange={onUploadLogo} className="hidden" />
                      <Button onClick={() => logoInputRef.current?.click()} variant="outline" className="flex items-center gap-2"><Upload size={14} /> Upload</Button>
                      <Button variant="destructive" onClick={removeLogo}><Trash2 size={14} /> Remove</Button>
                    </div>
                  </div>
                </div>

                {/* Cover upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover / Banner</label>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-16 rounded-md overflow-hidden border bg-gray-50">
                      {theme.coverDataUrl ? (
                        <img src={theme.coverDataUrl} alt="cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">No cover</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input ref={coverInputRef} type="file" accept="image/*" onChange={onUploadCover} className="hidden" />
                      <Button onClick={() => coverInputRef.current?.click()} variant="outline" className="flex items-center gap-2"><Upload size={14} /> Upload</Button>
                      <Button variant="destructive" onClick={removeCover}><Trash2 size={14} /> Remove</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Background upload */}
                <div>
                  <label className="text-sm font-medium">Dashboard Background</label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-20 h-12 rounded-md border overflow-hidden bg-gray-50">
                      {theme.backgroundDataUrl ? <img src={theme.backgroundDataUrl} alt="bg" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">None</div>}
                    </div>

                    <div className="flex gap-2">
                      <input ref={bgInputRef} type="file" accept="image/*" onChange={onUploadBackground} className="hidden" />
                      <Button onClick={() => bgInputRef.current?.click()} variant="outline" className="flex items-center gap-2"><Upload size={14} /> Upload</Button>
                      <Button variant="destructive" onClick={removeBackground}><Trash2 size={14} /> Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Save */}
            <div className="sticky bottom-4">
              <Button style={{ background: DELIGO }} className="w-full text-white flex items-center gap-2" onClick={() => { saveToLocal(); }}>
                <Save size={16} /> Save & Apply (demo)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
