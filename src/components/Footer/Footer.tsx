"use client";

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "@/src/hooks/use-translation";
import Link from "next/link";

export default function FooterDeligoPremium() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("PT");

  const languages = [
    { code: "PT", label: "Português" },
    { code: "EN", label: "English" },
  ];

  const companyLinks = [
    { name: t('footerAboutUs'), href: "/about-us" },
    { name: t('footerCareers'), href: "/careers" },
    { name: t('footerPress'), href: "/press" },
  ];

  const vendorLinks = [
    { name: t('footerBecomePartner'), href: "/become-vendor" },
    { name: t('footerHelpCenter'), href: "/help-center" },
    { name: t('footerVendorLogin'), href: "/login" },
  ];

  const legalLinks = [
    { name: t('footerPrivacyPolicy'), href: "/privacy" },
    { name: t('footerTerms'), href: "/terms" },
    { name: t('footerCookie'), href: "/cookie-policy" },
    { name: t('footerSecurity'), href: "/security" },
  ];

  const socials = [
  { icon: Facebook, url: "https://facebook.com/deligoeu" },
  { icon: Instagram, url: "https://www.instagram.com/deligo.pt" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/deligopt" },
  { icon: Youtube, url: "https://www.youtube.com/@DeliGoPT" },
];

  return (
    <footer className="relative bg-[#111] text-white overflow-hidden pt-24 pb-16 px-6 sm:px-12 lg:px-24">

      {/* Soft top gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,49,115,0.22),transparent_70%)] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: -25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-extrabold text-center text-white tracking-wide mb-14"
      >
        {t('footerTitle')}{" "}
        <span className="text-[#DC3173]">{t('footerTitleSmart')}</span>
      </motion.h2>

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">

        {/* COMPANY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-bold mb-3 text-[#DC3173]">{t('footerCompany')}</h3>
          <ul className="space-y-2 text-gray-300">
            {companyLinks.map((l, i) => (
              <li key={i}>
                <Link className="hover:text-[#ff7eb3] transition-colors" href={l.href}>
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* VENDORS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h3 className="text-lg font-bold mb-3 text-[#DC3173]">{t('footerVendors')}</h3>
          <ul className="space-y-2 text-gray-300">
            {vendorLinks.map((l, i) => (
              <li key={i}>
                <Link className="hover:text-[#ff7eb3] transition-colors" href={l.href}>
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* LEGAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-3 text-[#DC3173]">{t('footerLegal')}</h3>
          <ul className="space-y-2 text-gray-300">
            {legalLinks.map((l, i) => (
              <li key={i}>
                <Link className="hover:text-[#ff7eb3] transition-colors" href={l.href}>
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* SOCIAL */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.3 }}
>
  <h3 className="text-lg font-bold mb-3 text-[#DC3173]">{t('footerConnect')}</h3>
  <div className="flex gap-5 items-center">
    {socials.map((s, i) => (
      <motion.a
        key={i}
        whileHover={{ scale: 1.25 }}
        className="text-gray-300 hover:text-[#DC3173] transition"
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <s.icon className="w-7 h-7" />
      </motion.a>
    ))}
  </div>
</motion.div>

        {/* LANGUAGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className="text-lg font-bold mb-3 text-[#DC3173]">
            {t('footerLanguage')}
          </h3>
          <select
            className="bg-[#1b1b1d] text-gray-200 px-4 py-3 rounded-xl border border-gray-600 hover:border-[#DC3173] transition w-full font-medium"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mt-12 pt-6 max-w-6xl mx-auto" />

      {/* COPYRIGHT */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center text-gray-400 text-sm"
      >
        © {new Date().getFullYear()} {t('footerCopyright')}{" "}
        <span className="text-[#DC3173] font-bold">{t('footerCopyrightEfficiency')}</span>
      </motion.div>
    </footer>
  );
}
