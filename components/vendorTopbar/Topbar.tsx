"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  AlertTriangle,
  Bell,
  MessageSquare,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

const PRIMARY = "#DC3173";

type Props = {
  // pass this from parent if you want topbar to shift when sidebar collapses
  sidebarWidth?: number; // default 280
};

export default function Topbar({ sidebarWidth = 280 }: Props) {
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // close dropdowns on escape / outside click (simple)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setProfileOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const LANGS = [
    { code: "en", label: "English" },
    { code: "pt", label: "Português" },
    { code: "es", label: "Español" },
  ];

  return (
    <>
      {/* Topbar container - fixed at top */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-pink-100"
        style={{ height: 64 }}
      >
        <div
          className="flex items-center justify-between h-full px-4 md:px-6"
          // shift right to account for desktop sidebar; you can pass sidebarWidth from parent
          style={{
            paddingLeft: typeof sidebarWidth === "number" ? undefined : undefined,
          }}
        >
          {/* LEFT: intentionally empty to satisfy \"no left content\" requirement */}
          <div className="flex-1 h-full flex items-center">
            {/* empty - keep spacing */}
          </div>

          {/* RIGHT: icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language selector */}
            <div className="relative">
              <motion.button
                onClick={() => {
                  setLangOpen((s) => !s);
                  setProfileOpen(false);
                }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                aria-label="language selector"
              >
                <Globe size={18} className="text-gray-700" />
                <ChevronDown
                  size={16}
                  className={`text-gray-700 transition-transform ${langOpen ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-pink-100 rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLangOpen(false)}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SOS button - pulsing / glow */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-white font-semibold shadow"
              style={{
                background: "linear-gradient(90deg,#ff3b30,#ff6b6b)",
                boxShadow: `0 4px 18px ${PRIMARY}33`,
              }}
              aria-label="SOS"
              onClick={() => {
                // You can wire actual SOS logic here
                alert("SOS triggered");
              }}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-lg"
                style={{ background: PRIMARY, opacity: 0.06 }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <AlertTriangle size={18} />
            </motion.button>

            {/* Notification */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.06 }}
                className="p-2 rounded-lg hover:bg-pink-50 transition"
                aria-label="notifications"
              >
                <Bell size={18} className="text-gray-700" />
              </motion.button>

              {/* badge */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-pink-600 rounded-full border-2 border-white"
              />
            </div>

            {/* Messages */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              className="p-2 rounded-lg hover:bg-pink-50 transition"
              aria-label="messages"
              onClick={() => {
                // optional
              }}
            >
              <MessageSquare size={18} className="text-gray-700" />
            </motion.button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((s) => !s);
                  setLangOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-pink-50 transition"
                aria-label="profile"
              >
                {/* avatar (replace src with real url) */}
                <Image
                  src="/profile.jpg"
                  alt="avatar"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-pink-200"
                />
                <ChevronDown
                  size={16}
                  className={`text-gray-700 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 mt-2 w-44 bg-white border border-pink-100 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <button
                      className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-pink-50"
                      onClick={() => {
                        setProfileOpen(false);
                        // navigate to profile if needed
                      }}
                    >
                      <User size={16} /> Profile
                    </button>

                    <button
                      className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-pink-50"
                      onClick={() => {
                        setProfileOpen(false);
                        // navigate to settings
                      }}
                    >
                      <ChevronDown size={16} /> Settings
                    </button>

                    <div className="border-t border-pink-50" />

                    <button
                      className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setProfileOpen(false);
                        // call logout logic
                        alert("Logged out (demo)");
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile: hamburger to open compact menu (only visible on small screens) */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="p-2 rounded-lg hover:bg-pink-50 transition"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-down panel (compact actions) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="md:hidden fixed top-16 right-4 z-50"
          >
            <div className="w-56 bg-white border border-pink-100 rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col">
                {/* languages */}
                <div className="px-3 py-2 border-b border-pink-50">
                  <div className="text-xs text-gray-500 mb-1">Language</div>
                  <div className="flex gap-2">
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        className="px-2 py-1 rounded-md hover:bg-pink-50 text-sm text-gray-700"
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="px-4 py-3 text-sm flex items-center gap-2 hover:bg-pink-50"
                  onClick={() => {
                    alert("SOS triggered");
                    setMobileMenuOpen(false);
                  }}
                >
                  <AlertTriangle size={16} /> SOS
                </button>

                <button className="px-4 py-3 text-sm flex items-center gap-2 hover:bg-pink-50">
                  <Bell size={16} /> Notifications
                </button>

                <button className="px-4 py-3 text-sm flex items-center gap-2 hover:bg-pink-50">
                  <MessageSquare size={16} /> Messages
                </button>

                <div className="border-t border-pink-50" />

                <button
                  className="px-4 py-3 text-sm flex items-center gap-2 hover:bg-pink-50"
                  onClick={() => {
                    alert("logout (demo)");
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* spacer so page content doesn't hide under fixed topbar */}
      <div style={{ height: 64 }} />
    </>
  );
}
