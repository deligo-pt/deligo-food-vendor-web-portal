"use client";

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FooterPremiumNextLevel() {
  const [language, setLanguage] = useState("PT");

  const languages = [
    { code: "PT", label: "Português", flag: (
        <svg className="w-5 h-5 rounded-full" viewBox="0 0 512 512">
          <rect width="512" height="512" fill="#006600"/>
          <rect y="170" width="512" height="170" fill="#FFCC00"/>
          <circle cx="256" cy="256" r="80" fill="#D80027"/>
        </svg>
      ) 
    },
    { code: "EN", label: "English", flag: (
        <svg className="w-5 h-5 rounded-full" viewBox="0 0 60 30">
          <clipPath id="t">
            <path d="M0,0 v30 h60 v-30 z"/>
          </clipPath>
          <clipPath id="s">
            <path d="M30,15 v15 h30 v-15 z"/>
          </clipPath>
          <g clipPath="url(#t)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 l60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6"/>
            <path d="M0,0 l60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#FFF" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      )
    },
  ];
  const companyLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ];

  const vendorLinks = [
    { name: "Become a Partner", href: "/become-vendor" },
    { name: "Help Center", href: "/help-center" },
    { name: "Vendor Login", href: "/login" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Security", href: "/security" },
  ];

  return (
    <footer className="bg-gradient-to-t from-gray-900 via-gray-950 to-black text-white py-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-bold text-lg mb-4">Company</h3>
          <ul className="space-y-2">
            {companyLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="hover:text-pink-400 transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Vendors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h3 className="font-bold text-lg mb-4">Vendors</h3>
          <ul className="space-y-2">
            {vendorLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="hover:text-pink-400 transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="font-bold text-lg mb-4">Legal</h3>
          <ul className="space-y-2">
            {legalLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="hover:text-pink-400 transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Social + Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="font-bold text-lg mb-4">Connect & Language</h3>
          <div className="flex items-center gap-4 mb-6">
            <motion.a
              href="https://www.facebook.com/deligoeu"
              target="_blank"
              whileHover={{ scale: 1.2, color: "#FF7EB3" }}
              className="transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              whileHover={{ scale: 1.2, color: "#FF7EB3" }}
              className="transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/deligopt"
              target="_blank"
              whileHover={{ scale: 1.2, color: "#FF7EB3" }}
              className="transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@DeliGoPT"
              target="_blank"
              whileHover={{ scale: 1.2, color: "#FF7EB3" }}
              className="transition-colors"
            >
              <Youtube className="w-6 h-6" />
            </motion.a>
          </div>

          {/* Language Switcher */}
           <motion.div className="inline-block relative">
      <motion.select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="appearance-none bg-gray-800 text-white px-4 py-2 rounded-xl shadow-inner focus:outline-none hover:bg-gray-700 transition pr-12"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </motion.select>

      {/* SVG flag + code overlay */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        {languages.find((l) => l.code === language)?.flag}
        <span className="ml-2 text-white font-medium">{language}</span>
      </div>
    </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="mt-12 text-center text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        &copy; {new Date().getFullYear()} DeliGo. All rights reserved.
      </motion.div>
    </footer>
  );
}
